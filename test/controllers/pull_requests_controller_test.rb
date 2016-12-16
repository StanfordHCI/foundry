require 'test_helper'

class PullRequestsControllerTest < ActionController::TestCase
  setup do
    PullRequest.delete_all
    User.delete_all
    
    @user = User.create(username: "testuser", password: "testpass", password_confirmation: "testpass")
    session[:user_id] = @user.id
    
    @pull_request = PullRequest.create!({new_json: '{"a": "new"}', ancestor_json: '{"a": "old"}', parent_team_id: 1, author_id: @user.id, timestamp: Time.new})
  end

  test "should get index" do
    get :index
    assert_response 200
    prs = JSON.parse(response.body)
    assert_equal PullRequest.count, prs.length
  end

  test "should create pull_request" do
    assert_difference 'PullRequest.count' do
      post :create, {
        new_json: '{"b": "new"}',
        ancestor_json: '{"b": "old"}',
        parent_team_id: 1,
      }
    end
    assert_response 200
  end

  test "should not create pull_request" do
    assert_no_difference 'PullRequest.count' do
      post :create, pull_request: {
        new_json: 5, # should be a string, so test will fail
        ancestor_json: '{"a": "old"}',
        parent_team_id: 1
      }
    end
    assert_response 500

    errors = JSON.parse(response.body)["errors"]
    assert_not_equal 0, errors.length
  end

  test "should show pull_request" do
    get :show, id: @pull_request
    assert_response 200
  end

  test "should update pull_request" do
    put :update, id: @pull_request, new_json: '{"b": "new"}', ancestor_json: '{"b": "old"}', parent_team_id: 2, status: :merged
    assert_response 200

    pr = PullRequest.new(JSON.parse(response.body))
    assert_equal "new", pr.new_json["b"] # changed
    assert_equal "merged", pr.status # changed
    assert_equal 1, pr.parent_team_id # same as before, since not permitted
  end

  test "should destroy pull_request" do
    assert_difference('PullRequest.count', -1) do
      delete :destroy, id: @pull_request
    end
  end
end
