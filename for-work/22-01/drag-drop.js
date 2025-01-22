// controller/MainViewController.js
Ext.define('MyApp.controller.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    onDocumentDrop: function (node, data, overModel, dropPosition, eOpts) {
        const draggedRecords = data.records;
        const targetFolder = overModel.get('text');

        draggedRecords.forEach(record => {
            console.log(`Moved document "${record.get('name')}" to folder "${targetFolder}"`);
            // Add logic to update server or stores
        });
    },

    onFolderDrop: function (node, data, overModel, dropPosition, eOpts) {
        const draggedNode = data.records[0];
        const targetNode = overModel;

        console.log(`Moved folder "${draggedNode.get('text')}" under "${targetNode.get('text')}"`);
        // Add logic to update server or tree store
    }
});

// view/DocumentsGrid.js
Ext.define('MyApp.view.DocumentsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'documentsgrid',
    title: 'Documents',
    store: {
        type: 'documents' // Reference the documents store by alias
    },
    columns: [
        { text: 'Name', dataIndex: 'name', flex: 1 },
        { text: 'Size', dataIndex: 'size', flex: 1 }
    ],
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            enableDrag: true,
            enableDrop: false // Prevent dropping into the grid
        }
    }
});

// view/FoldersTree.js
Ext.define('MyApp.view.FoldersTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'folderstree',
    title: 'Folders',
    rootVisible: false,
    store: {
        type: 'folders' // Reference the folders store by alias
    },
    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            enableDrag: true,
            enableDrop: true // Enable dropping into folders
        }
    },
    listeners: {
        drop: 'onFolderDrop' // Handle drop events for folder reordering
    }
});

// view/Main.js
Ext.define('MyApp.view.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainview',
    controller: 'main',
    layout: 'hbox',
    items: [
        {
            xtype: 'documentsgrid',
            flex: 1
        },
        {
            xtype: 'folderstree',
            flex: 1,
            listeners: {
                drop: 'onDocumentDrop' // Handle drop events for documents
            }
        }
    ]
});

// app.js
Ext.application({
    name: 'MyApp',
    appFolder: 'app',
    requires: [
        'MyApp.store.DocumentsStore',
        'MyApp.store.FoldersStore',
        'MyApp.view.Main'
    ],

    launch: function () {
        Ext.create('MyApp.view.Main', {
            renderTo: Ext.getBody(),
            width: 800,
            height: 400
        });
    }
});