/* eventDetails.js
 * ---------------------------------------------
 * Data structure with all of the details to draw an event.
 * Written by Jare.
 */


if(!window._foundry) {
    window._foundry = {};
}

(function() {
  var events = {
    bodyHeight: 64,
    
    tabHeight: 11,
    
    get totalHeight() {
        return events.bodyHeight + events.tabHeight;
    },
    
    get marginTop() {
        return (window._foundry.timeline.rowHeight - events.totalHeight)/2;
    },
    
    marginLeft: 4,
    
    iconOpacity: 0.38,
    
    /**
     * @param {object} eventObj
     * @returns true if the current user is assigned this task
     */
    isWorkerTask: function(eventObj) {
        return current_user && eventObj.members.indexOf(current_user.id) > - 1;
    },
    
    /**
     * @param {string} text
     * @param {number} workingWidth
     * @param {object} [style]
     * @param {number} eventObjectId
     * @returns The string truncated enough to fit inside of the given working
     * width
     */
    getShortenedString: function(text, workingWidth, eventObjectId, style) {
        var textSvg = d3.select("#g_" + eventObjectId).append("text")
            .style(style)
            .style({color: "transparent"})
            .text(text);
        
        var length = text.length;
        while (textSvg.node().getBBox().width > workingWidth) {
            if(length === 0) {
                text = '...';
                break;
            }
            length--;
            text = text.substr(0, length) + "...";
            textSvg.text(text);
        }

        textSvg.remove();
        return text;
    },
    
    title: {
        selector: ".title",
        tag: "text",
        text: function(eventObj) {
            var title = eventObj.title;
            //var clockAttrs = events.clock.attrs;
            
            
            var workingWidth =   getWidth(eventObj)
                               - 2 * events.marginLeft
                               //- clockAttrs.width(d3.select("#g_" + eventObj.id).data()[0])
                               //- 10 // clock's left margin
                               - 10 // right margin
                               - 5;
            
            return events.getShortenedString(
                title, workingWidth, eventObj.id, events.title.style);
        },
        
        attrs: {
            "class": "title",
            // x: function(d) {
            //     var attrs = events.clock.attrs;
            //     return attrs.x(d) + attrs.width(d) + 5;
            // },
            x: function(d) {return d.x + 10},
            y: function(d) {return d.y + 19}
        },
        
        style: {
            "font-family": "proxima-nova",
            fill: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "#444" : "white";
            },
            "font-weight": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                //return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    //400 : 300;
                return eventObj.status === "not_started" && events.isWorkerTask(eventObj) ?
                    600 : 400;
            },
            "letter-spacing": "1px",
            "font-size": "12px",
            "text-transform": "uppercase"
        }
    },
    
    duration: {
        selector: ".duration",
        tag: "text",
        /**
         * @param {object} eventObj
         * @returns {string} the event's duration in the format 'x hrs y min'
         */
        text: function(eventObj) {
            if(eventObj.status == "paused"){
                var timeStr = "PAUSED";
            }

            else if(eventObj.status == "completed"){
                var timeStr = "COMPLETED";
            }

            else{
                var time = eventObj.timer || eventObj.duration;
                var sign = (time / Math.abs(time) < 0) ? "-" : "";
                
                var hours = Math.floor(Math.abs(time) / 60);
                var minutes = Math.abs(time) % 60;

                var durationArray = [];
                if(hours !== 0) {
                    durationArray.push(hours + " " + (hours === 1 ? "hr" : "hrs"));
                }
                
                if(minutes !== 0) {
                    var minStr = (eventObj.timer || time > 30 ? " min" : "");
                    durationArray.push(minutes + minStr);
                }

                var timeStr = sign + durationArray.join(" ");
            }  
                        
            var d3Datum = d3.select("#g_" + eventObj.id).data()[0];
            var workingWidth =   getWidth(eventObj)
                               - 2 * events.marginLeft
                               - 10; // right padding
            return events.getShortenedString(
                timeStr, workingWidth, eventObj.id, events.duration.style);
        },
        
        attrs: {
            "class": "duration",
            x: function(d) {return d.x + 10},
            y: function(d) {return d.y + 32}
        },
        
        style: {
            "font-family": "proxima-nova",
            fill: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "#444" : "white";
            },
            "font-weight": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    400 : 300;
            },
            "letter-spacing": "1px",
            "font-size": "10px",
            "text-transform": "uppercase"
        }
    },
    
    line: {
        selector: ".underline",
        tag: "line",
        attrs: {
            x1: function(d) {return d.x + 10},
            y1: function(d) {return d.y + 40},
            y2: function(d) {return d.y + 40},
            "class": "underline"
        },
        style: {
            "stroke": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.24)"
            },
            "stroke-width": "1px"
        }
    },
    
    bottomBorder: {
        selector: ".bottom-border",
        tag: "rect",
        attrs: {
            x: function(d) {return d.x},
            y: function(d) {return d.y + events.bodyHeight},
            height: function(d) {return 2},
            class: "bottom-border"
        }
    },
    
    numMembersIcon: {
        selector: ".num-members-icon",
        tag: "image",
        attrs: {
            x: function(d) {return d.x + 10},
            y: function(d) {return d.y + events.bodyHeight - 18},
            width: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                // set the width to zero if this is an hour long event
                return eventObj.duration <= 60 ? 0 : 12;
            },
            height: 12,
            "xlink:href": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "/assets/icons/member/member.svg" : "/assets/icons/member/member_white.svg";
            },
            "class": "num-members-icon",
            
            // tooltip stuff
            "data-toggle": "tooltip",
            "data-placement": "bottom",
            "data-container": "body",
            "data-animation": false,
            title: function(d) {
                var id = d.id.substr("task_g_".length);
                var event = getEventFromId(id);
                var str = event.members.length +
                    (event.members.length === 1 ? " member" : " members");
                return str;
            }
        },
        
        style: {
            opacity: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    events.iconOpacity : 1;
            }
        }
    },
    
    numMembers: {
        selector: ".num-members",
        tag: "text",
        text: function(eventObj) {return eventObj.members.length || 0;},
        attrs: {
            x: function(d) {
                var attrs = events.numMembersIcon.attrs;
                return attrs.x(d) + attrs.width(d) + 4;
            },
            y: function(d) {return d.y + window._foundry.events.bodyHeight - 9},
            style: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                // don't display the number of members if the event
                // is an hour or shorter
                return eventObj.duration <= 60 ? "display:none;" : "";
            },
            "class": "num-members"
        },
        style: {
            "font-size": "8px",
            fill: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "black" : "white";
            },
            "font-weight": 200,
            "font-family": "Helvetica"
        }
    },
    configIcon: {
      selector: ".icon-cog",
      tag: "image",
      attrs: {
          x: function(d) {
              var groupNum = parseInt(d.id.replace("task_g_", ""));
              var eventObj = getEventFromId(groupNum);
              var attrs = events.numMembers.attrs;
              //return attrs.x(d) + 15;
              return eventObj.duration <= 60 ? attrs.x(d) - 4 : attrs.x(d) + 15;
          },
          y: function(d) {return d.y + events.bodyHeight - 18},
          width: function(d) {
              var groupNum = parseInt(d.id.replace("task_g_", ""));
              var eventObj = getEventFromId(groupNum);
              // set the width to zero if the duration of event is 45 mins or less
              return eventObj.duration <= 45 ? 0 : 12;
          },
          height: 12,
          "xlink:href": function(d) {
              var groupNum = parseInt(d.id.replace("task_g_", ""));
              var eventObj = getEventFromId(groupNum);
              return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                  "/assets/icons/config/icon-cog.svg" : "/assets/icons/config/icon-cog_white.svg";
          },
          "class": "icon-cog",

          // tooltip stuff
          "data-toggle": "tooltip",
          "data-placement": "bottom",
          "data-container": "body",
          "data-animation": false,
          title: "Configuration"
      },

      style: {
          opacity: function(d) {
              var groupNum = parseInt(d.id.replace("task_g_", ""));
              var eventObj = getEventFromId(groupNum);
              return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                  events.iconOpacity : 1;
          }
      }
    },
    uploadIcon: {
        selector: ".upload",
        tag: "image",
        attrs: {
            x: function(d) {
                var iconWidth = events.uploadIcon.attrs.width(d);
                return events.collabIcon.attrs.x(d) - iconWidth;
            },
            y: function(d) {return d.y + events.bodyHeight - 19},
            width: function(d) {
                var iconWidth = 14;
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                var width = getWidth(eventObj) - 2 * events.marginLeft;
                var workingWidth = width - 2 * 10;
                if(workingWidth/3 < iconWidth) {
                    iconWidth = Math.floor(width/3) - 2;
                }
                return iconWidth;
            },
            height: 14,
            "xlink:href": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                //console.log(d);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "/assets/icons/upload/upload.svg" : "/assets/icons/upload/upload_white.svg";
            },
            "class": "upload",
            
            // tooltip stuff
            "data-toggle": "tooltip",
            "data-placement": "bottom",
            "data-container": "body",
            "data-animation": false,
            title: "Upload files"
        },
        style: {
            cursor: "pointer",
            opacity: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    events.iconOpacity : 1;
            }
        }
    },
    collabIcon: {
        selector: ".collab_btn",
        tag: "image",
        attrs: {
            x: function(d) {
                var iconWidth = events.collabIcon.attrs.width(d);
                return events.handoffIcon.attrs.x(d) - iconWidth;
            },
            y: function(d) {return d.y + events.bodyHeight - 18},
            width: function(d) {
                var iconWidth = 14;
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                var width = getWidth(eventObj) - 2 * events.marginLeft;
                var workingWidth = width - 2 * 10;
                if(workingWidth/3 < iconWidth) {
                    iconWidth = Math.floor(width/3) - 2;
                }
                return iconWidth;
            },
            height: 14,
            "xlink:href": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "/assets/icons/collaboration/collaboration.svg" :
                    "/assets/icons/collaboration/collaboration_white.svg";
            },
            id: function(d) {return "collab_btn_" + d.groupNum;},
            "class": "collab_btn",
            groupNum: function(d) {return d.groupNum},
            
            // tooltip stuff
            "data-toggle": "tooltip",
            "data-placement": "bottom",
            "data-container": "body",
            "data-animation": false,
            title: "Draw collaboration"
        },
        
        style: {
            opacity: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    events.iconOpacity : 1;
            }
        }
    },
    
    handoffIcon: {
        selector: ".handoff_btn",
        tag: "image",
        attrs: {
            x: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                var width = getWidth(eventObj) - 2 * events.marginLeft;
                var iconWidth = events.handoffIcon.attrs.width(d);
                
                // subtract the button's width and the right margin
                if(iconWidth !== 15) {
                    // if the width is to small to fit everything, just
                    // center the icons, don't worry about the padding
                    return (d.x + width - iconWidth) - (width - 3 * iconWidth)/2;
                } else {
                    return d.x + width - iconWidth - 10;
                }
            },
            y: function(d) {return d.y + events.bodyHeight - 19},
            width: function(d) {
                var iconWidth = 15;
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                var width = getWidth(eventObj) - 2 * events.marginLeft;
                var workingWidth = width - 2 * 10;
                
                if(workingWidth/3 < iconWidth) {
                    iconWidth = Math.floor(width/3) - 2;
                }
                
                return iconWidth;
            },
            height: 15,
            "xlink:href": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "/assets/icons/arrow/right_arrow.svg" :
                    "/assets/icons/arrow/right_arrow_white.svg";
            },
            id: function(d) {return "handoff_btn_" + d.groupNum;},
            class: "handoff_btn",
            groupNum: function(d) {return d.groupNum},
            
            // tooltip stuff
            "data-toggle": "tooltip",
            "data-placement": "bottom",
            "data-container": "body",
            "data-animation": false,
            title: "Draw handoff"
        },
        
        style: {
            opacity: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    events.iconOpacity : 1;
            }
        }
    },
    
    leftHandle: {
        selector: ".left-handle",
        tag: "rect",
        attrs: {
            x: function(d) {return d.x + 4},
            y: function(d) {return d.y + (events.bodyHeight - 11)/2},
            width: 2,
            height: 11,
            rx: 1,
            ry: 1,
            "class": "left-handle"
        },
        style: {
            display: "none",
            cursor: "ew-resize",
            fill: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "rgba(0, 0, 0, 0.2" : "rgba(255, 255, 255, 0.8)";
            }
        }
    },
    
    rightHandle: {
        selector: ".right-handle",
        tag: "rect",
        attrs: {
            x: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                var width = getWidth(eventObj);
                return d.x + width - 2 * events.marginLeft - 2 - 4;
            },
            y: function(d) {return d.y + (events.bodyHeight - 11)/2},
            width: 2,
            height: 11,
            rx: 1,
            ry: 1,
            "class": "right-handle",
        },
        
        style: {
            display: "none",
            cursor: "ew-resize",
            fill: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "rgba(0, 0, 0, 0.2" : "rgba(255, 255, 255, 0.8)";
            }
        }
    }
  };
  
  window._foundry.events = events;
})();