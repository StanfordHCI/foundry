(function(window) {
    /**
     * Removes all instances of an object from an array
     * @param needle
     * @param {array} haystack
     */
    var removeFromList = function(needle, haystack) {
        for(var i = 0; i < haystack.length; i++) {
            if(haystack[i] === needle) {
                haystack.splice(i, 1);
                i--;
            }
        }
    };
    
    /**
     * Removes all instances of an object with the same value for the attribute
     * as the needle from an array
     * @param {string} attr
     * @param needle
     * @param {array} haystack
     */
    var removeAttrFromList = function(attr, needle, haystack) {
        for(var i = 0; i < haystack.length; i++) {
            if(haystack[i][attr] === needle[attr]) {
                haystack.splice(i, 1);
                i--;
            }
        }
    };
    
    var EntryManager = function(flashTeamsJSON) {
        this.currentFolderId = this._rootId;
        this.memberData = {
            _entry_map: {}
        };
        
        this.folders = [];
        this.members = [];

        if(flashTeamsJSON.folders) {
            for(var i = 0; i < flashTeamsJSON.folders.length; i++) {
                this.addEntry(flashTeamsJSON.folders[i]);
            }
        }
        
        if(flashTeamsJSON.members) {
            for(var i = 0; i < flashTeamsJSON.members.length; i++) {
                this.addEntry(flashTeamsJSON.members[i]);
            }
        }
        
        flashTeamsJSON.members = this.members;
        flashTeamsJSON.folders = this.folders;
    };
    
    EntryManager.prototype._rootId = "root";
    
    EntryManager.prototype._generateRootFolder = function() {
        return {
            name: "All Roles", parentId: undefined, type: "folder",
            id: EntryManager.prototype._rootId, childIds: [], numMembers: 0};
    };

    EntryManager.prototype.getCurrentFolderChildren = function() {
        return this.getEntriesFromIds(
            this._getChildIdsById(this.currentFolderId));
    };

    EntryManager.prototype._getEntryParentProp = function(entry, prop) {
        var parentProps = [];

        if(entry === undefined) {return parentProps;}

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
        return this.memberData._entry_map[String(id)].childIds;
    };

    /**
     * @param {string|number} id
     * @returns the entry with the given id
     */
    EntryManager.prototype.getEntryById = function(id) {
        if(id === undefined) {return undefined;}
        return this.memberData._entry_map[String(id)];
    };
    
    /**
     * @param {string} uniq
     * @returns the member with the given uniq
     */
    EntryManager.prototype.getEntryByUniq = function(uniq) {
        for(var i = 0; i < this.members.length; i++) {
            var member = this.getEntryById(this.members[i]);
            if(member.uniq === uniq) {
                return member;
            }
        }
    };
    
    /**
     * Calls the passed in function on every stored member's ID
     * @param {function} callback
     */
    EntryManager.prototype.eachMemberId = function(callback) {
        var that = this;
        this.eachMember(function(member, i) {
            return callback(member.id, new Number(i));
        });
    };
    
    /**
     * Calls the passed in function on every stored member object
     * @param {function} callback
     */
    EntryManager.prototype.eachMember = function(callback) {
        for(var i = 0; i < this.members.length; i++) {
            if(callback(this.members[i], new Number(i)) === true) { break; }
        }
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
        if(this.currentFolderId === this._rootId && !folder) {
            this.memberData._entry_map[this._rootId] = this._generateRootFolder();
            folder = this.memberData._entry_map[this._rootId];
        }

        // only push and increment the number of members if this entry isn't
        // already in this folder
        var notInFolder = true;
        for(var i = 0; i < folder.childIds.length; i++) {
            if(folder.childIds[i] == entry.id) {
                notInFolder = false;
            }
        }
        
        if(notInFolder) {
            // set the parentId member
            entry.parentId = folderId;
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
     * @param {object} [folderId] If specified, adds the folder with this id.
     * Otherwise, adds it to the entry's set parentId or, if that's not set,
     * to the current folder.
     */
    EntryManager.prototype.addEntry = function(entry, folderId) {
        
        // update the number of stored items before we actually add it to
        // the store
        if(this.isFolder(entry)) {
            if(this.folderExists(entry.id)) {
                removeAttrFromList('id', entry, this.folders);
            }
            this.folders.push(entry);
            
        } else if(this.isMember(entry)) {
            if(this.memberExists(entry.id)) {
                removeAttrFromList('id', entry, this.members);
            }
            this.members.push(entry);
        }
        
        // any entry added to the EntryManager must have a String id, so we
        // make sure that's the case before we add anything
        entry.id = String(entry.id);
        this.memberData._entry_map[entry.id] = entry;
        
        // check parent id field and use that. If there is no parent id set,
        // _addEntryToFolder defaults to the current folder
        folderId = folderId || entry.parentId;
        
        this._addEntryToFolder(entry, folderId);
    };

    /**
     * Removes an entry from the entries json
     * @param {object} id The id of the entry that should be removed
     * @param {boolean} [recursive] If the entry is a folder, recursively
     * delete all of its child elements. Defaults to true.
     */
    EntryManager.prototype.removeEntry = function(id, recursive) {
        if(recursive === undefined) recursive = true;
        if(this.memberData._entry_map) {
            var e = this.getEntryById(id);
            if(e) {
                // if this is a folder, recursively delete all children
                if(this.isFolder(e) && recursive) {
                    for(var i = e.childIds.length-1; i >= 0; i--) {
                        this.removeEntry(e.childIds[i]);
                    }
                }
                
                // find a parent id and remove this entry's id from the
                // parent's list of child entries
                // if there's no parentId set, assume it's in the root
                var parentId = e.parentId || this._rootId;
                var parent = this.getEntryById(parentId);
                
                if(parent && parent.childIds) {
                    for(var i = 0; i < parent.childIds.length; i++) {
                        if(parent.childIds[i] == id) {
                            parent.childIds.splice(i, 1);
                            if(this.isMember(e)) { parent.numMembers--; }
                            break;
                        }
                    }
                }
                
                if(this.isFolder(e)) {
                    removeAttrFromList('id', e, this.folders);
                } else if(this.isMember(e)) {
                    removeAttrFromList('id', e, this.members);
                }
                
                // actually delete the entry map's reference to the entry
                delete this.memberData._entry_map[id];
            }
        }
    };
    
    /**
     * Moves an entry from its current folder to a new one
     * @param {number|string} entryId
     * @param {number|string} destId A folder's ID
     */
    EntryManager.prototype.moveEntry = function(entryId, destId) {
        if(entryId == destId ||
           !this.entryExists(entryId) || !this.folderExists(destId)) {
            return;
        }
        
        var entry = this.getEntryById(entryId);
        this.removeEntry(entryId, false);
        this.addEntry(entry, destId);
    };
    
    /**
     * Returns true if there's an entry stored with the given ID
     * @param {number|string} id
     */
    EntryManager.prototype.entryExists = function(id) {
        return this.getEntryById(id) !== undefined;
    };
    
    /**
     * Returns true if there's a member stored with the given ID
     * @param {number|string} memberId
     */
    EntryManager.prototype.memberExists = function(memberId) {
        return this.isMember(this.getEntryById(memberId));
    };
    
    /**
     * Returns true if there's a folder stored with the given ID
     * @param {number|string} folderId
     */
    EntryManager.prototype.folderExists = function(folderId) {
        return this.isFolder(this.getEntryById(folderId));
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
    
    /**
     * @returns the number of entries stored in the EntryManager
     */
    EntryManager.prototype.size = function() {
        return this.numFolders() + this.numMembers();
    };
    
    /**
     * @returns the number of members stored in the EntryManager
     */
    EntryManager.prototype.numMembers = function() {
        return this.members.length;
    };
    
    /**
     * @returns the number of folders stored in the EntryManager
     */
    EntryManager.prototype.numFolders = function() {
        return this.folders.length;
    };
    
    window.EntryManager = EntryManager;
})(window);