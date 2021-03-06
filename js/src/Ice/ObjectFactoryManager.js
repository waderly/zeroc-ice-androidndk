// **********************************************************************
//
// Copyright (c) 2003-2014 ZeroC, Inc. All rights reserved.
//
// This copy of Ice is licensed to you under the terms described in the
// ICE_LICENSE file included in this distribution.
//
// **********************************************************************

(function(global){
    require("Ice/Class");
    require("Ice/HashMap");
    require("Ice/LocalException");
    
    var Ice = global.Ice || {};
    
    var HashMap = Ice.HashMap;
    var AlreadyRegisteredException = Ice.AlreadyRegisteredException;
    var NotRegisteredException = Ice.NotRegisteredException;

    //
    // Only for use by Instance
    //
    var ObjectFactoryManager = Ice.Class({
        __init__: function()
        {
            this._factoryMap = new HashMap(); // Map<String, ObjectFactory>
        },
        add: function(factory, id)
        {
            var o, ex;
            o = this._factoryMap.get(id);
            if(o !== undefined)
            {
                ex = new AlreadyRegisteredException();
                ex.id = id;
                ex.kindOfObject = "object factory";
                throw ex;
            }
            this._factoryMap.set(id, factory);
        },
        remove: function(id)
        {
            var factory, ex;
            factory = this._factoryMap.get(id);
            if(factory === undefined)
            {
                ex = new NotRegisteredException();
                ex.id = id;
                ex.kindOfObject = "object factory";
                throw ex;
            }
            this._factoryMap.delete(id);
            factory.destroy();
        },
        find: function(id)
        {
            return this._factoryMap.get(id);
        },
        destroy: function()
        {
            var oldMap = this._factoryMap,
                e = oldMap.entries;
            this._factoryMap = new HashMap(); // Map<String, ObjectFactory>

            while(e !== null)
            {
                e.value.destroy();
                e = e.next;
            }
        }
    });
    
    Ice.ObjectFactoryManager = ObjectFactoryManager;
    global.Ice = Ice;
}(typeof (global) === "undefined" ? window : global));
