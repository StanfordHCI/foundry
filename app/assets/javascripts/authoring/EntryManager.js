(function(window) {
    var EntryManager = function(flashTeamsJSON) {
        this.currentFolderId = "root";
        this.memberData = flashTeamsJSON.member_data;

        // Backwards compatability check. If the member data field doesn't exist,
        // then we'll create it and populate it with the data from the members
        // field
        if(!this.memberData) {
            flashTeamsJSON.member_data = {
                _entry_map: {}
            }
            this.memberData = flashTeamsJSON.member_data;
            var members = flashTeamsJSON.members;
            for(var i = 0; i < members.length; i++) {
                this.addEntry(members[i]);
            }
        }
    };

    EntryManager.prototype._generateRootFolder = function() {
        return {
            name: "root", parentId: undefined, type: "folder",
            id: "root", childIds: [], numMembers: 0};
    };

    EntryManager.prototype.getCurrentFolderChildren = function() {
        return this.getEntriesFromIds(
            this._getChildIdsById(this.currentFolderId));
    };

    EntryManager.prototype._getEntryParentProp = function(entry, prop) {
        var parentProps = [];

        if(entry === undefined) return parentProps;

        var e = this.getEntryById(entry.parentId);
        while(e !== undefined) {
            parentProps.unshift(e[prop]);
            e = this.getEntryById(e.parentId);
        }
        return parentProps;
    };

    /**
     * Returns an array containing the ids of each of the passed in entry's
     * ancestors, starting with the root folder and ending with the entry's
     * direct parent
     * @param {object} entry
     */
    EntryManager.prototype.getEntryParentIds = function(entry) {
        return this._getEntryParentProp(entry, 'id');
    };

    /**
     * @param {object} entry
     * @returns an array containing the names of each of the passed in entry's
     * ancestors, starting with the root folder and ending with the entry's
     * direct parent
     */
    EntryManager.prototype.getEntryParentNames = function(entry) {
        return this._getEntryParentProp(entry, 'name');
    };

    /**
     * @param {string|number} id
     * @returns an array containing the ids of each of the children of the
     * event with the given id
     */
    EntryManager.prototype._getChildIdsById = function(id) {
        return this.memberData._entry_map[id].childIds;
    };

    /**
     * @param {string|number} id
     * @returns the entry with the given id
     */
    EntryManager.prototype.getEntryById = function(id) {
        return this.memberData._entry_map[id];
    };

    /**
     * @param {array.<string|number>} ids
     * @returns an array containing the entries that correspond to the given
     * ids
     */
    EntryManager.prototype.getEntriesFromIds = function(ids) {
        var entries = [];
        for(var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var entry = this.getEntryById(id);
            if(!entry) {
                ids.splice(i, 1);
                i--;
                continue;
            }
            entries.push(entry);
        }
        return entries;
    };

    /**
     * @param {object} entry
     * @param {string|number} folderId The id of the folder to add the entry to.
     * Defaults to the current folder.
     */
    EntryManager.prototype._addEntryToFolder = function(entry, folderId) {
        folderId = folderId || this.currentFolderId;

        var folder = this.memberData._entry_map[folderId];
        // special case the root folder
        if(this.currentFolderId === "root" && !folder) {
            this.memberData._entry_map["root"] = this._generateRootFolder();
            folder = this.memberData._entry_map["root"];
        }

        // only push and increment the number of members if this entry isn't
        // already in this folder
        var notInFolder = folder.childIds.indexOf(entry.id) < 0;
        if(notInFolder) {
            folder.childIds.push(entry.id);

            // update the number of members in this folder
            if(this.isMember(entry)) {
                folder.numMembers++;
            }
        }
    };

    /**
     * Stores the member in the entries json
     * @param {object} entry
     */
    EntryManager.prototype.addEntry = function(entry) {
        this.memberData._entry_map[entry.id] = entry;

        // check parent id field and use that. If there is no parent id set,
        // _addEntryToFolder defaults to the current folder
        var folderId = entry.parentId;
        this._addEntryToFolder(entry, folderId);
    };

    /**
     * Removes an entry from the entries json
     * @param {object} id The id of the entry that should be removed
     */
    EntryManager.prototype.removeEntry = function(id) {
        if(this.memberData._entry_map) {
            var e = this.getEntryById(id);
            if(e) {
                // find a parent id and remove this entry's id from the
                // parent's list of child entries
                if(e.parentId) {
                    var parent = this.getEntryById(e.parentId);
                    if(parent && parent.children) {
                        var i = parent.children.indexOf(id);
                        if(i !== -1) {
                            parent.children.splice(i, 1);
                            if(this.isMember(e)) {
                                parent.numMembers--;
                            }
                        }
                    }
                }

                // actually delete the entry map's reference to the entry
                delete this.memberData._entry_map[id];
            }
        }
    };

    /**
     * Assumes that the object passed in is an entry. Returns true if the entry
     * is non null and a not a folder and false otherwise.
     * @param {object} entry
     * @returns true if the entry is non null and not a folder, false otherwise
     */
    EntryManager.prototype.isMember = function(entry) {
        return entry && !this.isFolder(entry);
    };

    /**
     * Assumes that the object passed in is an entry. Returns true if the entry
     * is a folder and false otherwise.
     * @param {object} entry
     * @returns true if the entry is a folder, false otherwise
     */
    EntryManager.prototype.isFolder = function(entry) {
        return entry && entry.type === "folder";
    };
    
    window.EntryManager = EntryManager;
})(window);