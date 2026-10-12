/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8823747222907924, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [1.0, 500, 1500, "clk_fish"], "isController": true}, {"data": [1.0, 500, 1500, "clk_ProceedToCheckOut"], "isController": true}, {"data": [1.0, 500, 1500, "clk_Confirm"], "isController": true}, {"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.9992025518341308, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.5023809523809524, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.9920255183413078, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.9992063492063492, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [1.0, 500, 1500, "clk_Continue"], "isController": true}, {"data": [1.0, 500, 1500, "clk_AddtoCart"], "isController": true}, {"data": [1.0, 500, 1500, "clk_ProductId"], "isController": true}, {"data": [0.5, 500, 1500, "Launch WebPage"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5005, 0, 0.0, 293.47832167832223, 179, 941, 215.0, 616.0, 643.0, 688.0, 32.91572128506132, 140.22347613733515, 25.20199824898885], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 309, 0, 0.0, 212.24919093851133, 183, 303, 212.0, 225.0, 228.5, 240.39999999999986, 3.3304591506790255, 13.537610813214055, 1.994385239275706], "isController": false}, {"data": ["clk_fish", 310, 0, 0.0, 211.141935483871, 180, 288, 210.0, 224.0, 229.0, 235.77999999999997, 3.2449520061130706, 12.565295663540347, 1.9392840693791673], "isController": true}, {"data": ["clk_ProceedToCheckOut", 308, 0, 0.0, 212.3831168831169, 184, 314, 212.0, 225.10000000000002, 230.0, 241.55000000000013, 3.325559298609311, 18.21263334629006, 1.9258365860110565], "isController": true}, {"data": ["clk_Confirm", 305, 0, 0.0, 213.98688524590173, 184, 244, 214.0, 227.0, 231.7, 236.94, 3.2920300492185475, 17.555251968472067, 1.9417833493437529], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 634, 0, 0.0, 641.0189274447953, 549, 941, 635.0, 681.0, 694.0, 843.5499999999998, 4.1750628893542485, 23.00361798997721, 2.152766802323284], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 627, 0, 0.0, 211.10366826156286, 179, 518, 208.0, 223.0, 226.0, 306.1600000000001, 4.185636657365252, 0.8624700534219415, 3.6174691814143047], "isController": false}, {"data": ["login", 630, 0, 0.0, 634.249206349207, 201, 987, 629.5, 673.0, 689.4499999999999, 857.8699999999986, 4.166914697303411, 38.39875322233136, 8.548627801506042], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 627, 0, 0.0, 212.39074960127599, 179, 489, 211.0, 226.0, 230.0, 264.32000000000016, 4.185413134320388, 21.164130087413053, 2.5750100338103947], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 310, 0, 0.0, 211.141935483871, 180, 288, 210.0, 224.0, 229.0, 235.77999999999997, 3.2449859732864383, 12.56542719324415, 1.9393043692165977], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 308, 0, 0.0, 212.3831168831169, 184, 314, 212.0, 225.10000000000002, 230.0, 241.55000000000013, 3.3255952059601577, 18.212829995141178, 1.9258573800140366], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 309, 0, 0.0, 213.29126213592238, 185, 306, 213.0, 226.0, 230.5, 237.0, 3.333297375432843, 15.791782855632626, 1.9980337489617157], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 627, 0, 0.0, 423.66028708133933, 359, 738, 419.0, 448.0, 457.0, 600.9600000000012, 4.179498460184778, 21.995426955015397, 6.183535319511659], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 630, 0, 0.0, 212.59999999999985, 183, 533, 210.0, 224.0, 229.0, 303.729999999999, 4.166942258085852, 16.574085174284015, 2.4130827725047954], "isController": false}, {"data": ["clk_Continue", 306, 0, 0.0, 211.8529411764706, 183, 238, 211.0, 226.0, 230.64999999999998, 235.93, 3.3034653999784087, 15.349500364352803, 3.9067349603260286], "isController": true}, {"data": ["clk_AddtoCart", 309, 0, 0.0, 213.29126213592238, 185, 306, 213.0, 226.0, 230.5, 237.0, 3.333261418308127, 15.79161250566331, 1.9980121956646026], "isController": true}, {"data": ["clk_ProductId", 309, 0, 0.0, 212.24919093851133, 183, 303, 212.0, 225.0, 228.5, 240.39999999999986, 3.330423254761212, 13.537464903913516, 1.994363743654412], "isController": true}, {"data": ["Launch WebPage", 633, 0, 0.0, 640.693522906793, 549, 941, 635.0, 681.0, 693.3, 836.9599999999998, 4.223406881551117, 23.2699820563588, 2.177694173299795], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 306, 0, 0.0, 211.8529411764706, 183, 238, 211.0, 226.0, 230.64999999999998, 235.93, 3.3034297373449495, 15.349334658483661, 3.9066927850827478], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 305, 0, 0.0, 213.98688524590173, 184, 244, 214.0, 227.0, 231.7, 236.94, 3.292065582263862, 17.555441453851717, 1.9418043082884495], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5005, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
