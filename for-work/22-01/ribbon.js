using DevExpress.XtraBars.Ribbon;

// ...

var fileTab = options.ribbon.getTab(DevExpress.RichEdit.RibbonTabType.File);

// Get the number of items in the File tab
int itemCount = fileTab.Items.Count;

// Remove the second item (index 1)
fileTab.Items.RemoveAt(1); 

// Remove the last item
fileTab.Items.RemoveAt(itemCount - 1); 

// Remove the first item
fileTab.Items.RemoveAt(0);

using DevExpress.XtraBars.Ribbon;

// ...

var fileTab = options.ribbon.getTab(DevExpress.RichEdit.RibbonTabType.File);

// Get items to remove
var ribbonItemOpen = fileTab.getItem(DevExpress.RichEdit.FileTabItemId.Open);
var ribbonItemPrint = fileTab.getItem(DevExpress.RichEdit.FileTabItemId.Print);
var ribbonItemDownload = fileTab.getItem(DevExpress.RichEdit.FileTabItemId.Download); 

// Remove items
fileTab.removeItem(ribbonItemOpen);
fileTab.removeItem(ribbonItemPrint);
fileTab.removeItem(ribbonItemDownload);

// (Optional) Re-insert items at specific positions (adjust indices as needed)
// fileTab.insertItem(ribbonItemOpen, 0); 
// fileTab.insertItem(ribbonItemPrint, 1); 
// fileTab.insertItem(ribbonItemDownload, 2);