var indexedDBHelper=function(){var t=null,e=0,n=function(){var e=1,n=new Promise(function(n,o){var r=indexedDB.open("gtfsData",e);r.onupgradeneeded=function(e){t=e.target.result,e.target.transaction.onerror=indexedDB.onerror,t.objectStoreNames.contains("gtfsstation")&&t.deleteObjectStore("gtfsstation");t.createObjectStore("gtfsstation",{keyPath:"id"})},r.onsuccess=function(e){t=e.target.result,n()},r.onerror=function(t){o("Couldn't open DB")}});return n},o=function(n,o){var r=t.transaction(["gtfsstation"],"readwrite"),a=r.objectStore("gtfsstation");e++;var s=new Promise(function(t,r){var s=a.put({id:e,departure:n,arrival:o});s.onsuccess=function(e){t()},s.onerror=function(t){console.log(t.value),r("Couldn't add the passed item")}});return s},r=function(e,n){var o=[],r=t.transaction(["gtfsstation"],"readwrite"),a=r.objectStore("gtfsstation"),s=new Promise(function(t,e){var n=IDBKeyRange.lowerBound(0),r=a.openCursor(n);r.onsuccess=function(e){var n=e.target.result;null===n||void 0===n?t(o):(alert(n.value.departure+" "+n.value.arrival),n["continue"]())},r.onerror=function(t){e("Couldn't fetch items from the DB")}});return s},a=function(){var n=[],o=t.transaction(["gtfsstation"],"readwrite"),r=o.objectStore("gtfsstation"),a=new Promise(function(t,o){var a=IDBKeyRange.lowerBound(0),s=r.openCursor(a);s.onsuccess=function(o){var r=o.target.result;null===r||void 0===r?t(n):(n.push(r.value),r.value.id>e&&(e=r.value.id),r["continue"]())},s.onerror=function(t){o("Couldn't fetch items from the DB")}});return a},s=function(e){var n=new Promise(function(n,o){var r=t.transaction(["gtfsstation"],"readwrite"),a=r.objectStore("gtfsstation"),s=a["delete"](e);s.onsuccess=function(t){n()},s.onerror=function(t){console.log(t),o("Couldn't delete the item")}});return n};return{open:n,addgtfsstations:o,retreivegtfsstations:r,getAllgtfsstations:a,deletegtfsstation:s}}();