var selectTable;
var selectedTable;
var maxSelect = 5;
$(document).ready(function(){
  // selectTable = $('#dbTable').DataTable();
  Selection("Domain");

  $('#dbTable').on('click', 'tr', function(){
    var rowData = selectTable.row(this).data();
    window.open(subdir+"/traitDB/"+rowData["ID"]);
  });
  // $('#selectTable tbody').on('click', 'tr', function(){
  //   var rowData = selectTable.row(this).data();
  //   // console.log(rowData);
  //   var IDs = selectedTable.column(2).data();
  //   if(IDs.length>=maxSelect){
  //     alert("Sorry, you can only select up to "+maxSelect+" studies. Please delete one of selected studies to add another study.");
  //   }else{
  //     if(IDs.indexOf(rowData['ID'])<0){
  //       selectedTable.row.add([
  //         '<button>Delete</button>',
  //         '<input type="checkbox" class="plot">',
  //         rowData['ID'],
  //         rowData['PMID'],
  //         rowData['Year'],
  //         rowData['Domain'],
  //         rowData['ChapterLevel'],
  //         rowData['SubchapterLevel'],
  //         rowData['Trait'],
  //         rowData['Ncase'],
  //         rowData['Ncontrol'],
  //         rowData['N'],
  //         rowData['Population'],
  //         rowData['SNPh2'],
  //         rowData['website']
  //       ]).draw(false);
  //       showPlots(rowData['ID']);
  //     }
  //   }
  //   // console.log(IDs);
  // });

});

function Selection(type){
  var domain = $('#Domain').val();
  var chapter = $('#Chapter').val();
  var subchapter = $('#Subchapter').val();
  var trait = $('#Trait').val();
  var yearFrom = $('#yearFrom').val();
  var yearTo = $('#yearTo').val();
  var nMin = $('#nMin').val();
  var nMax = $('#nMax').val();
  if(yearFrom==""){yearFrom="null"}
  if(yearTo==""){yearTo="null"}
  if(nMin==""){nMin="null"}
  if(nMax==""){nMax="null"}

  if(type=="Domain"){
    chapter="null";
    subchapter="null";
    trait="null";
  }else if(type=="Chapter"){
    subchapter="null";
    trait="null";
  }else if(type=="Subchapter"){
    trait="null";
  }
  // $('#test').html(type+":"+domain+":"+chapter+":"+subchapter);
  SelectOptions(type, domain, chapter, subchapter, trait);
  TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax);
}

function SelectOptions(type, domain, chapter, subchapter, trait){
  $.ajax({
    url: subdir+"/traitDB/SelectOption",
    type: "POST",
    data: {
      type: type,
      domain: domain,
      chapter: chapter,
      subchapter: subchapter
    },
    processing: true,
    success: function(data){
      if(type=="Domain"){
        data = JSON.parse(data);
        $.each(data, function(key, val){
          var out = '<option value=null>-- Please select '+key+' of interest --</option>';
          $.each(val, function(k, v){
            out += '<option value="'+k+'">'+k+' ('+v+')</option>';
          });
          $('#'+key).html(out).selectpicker('refresh');
        });
      }else if(type=="Chapter"){
        data = JSON.parse(data);
        $.each(data, function(key, val){
          var out = '<option value=null>-- Please select '+key+' of interest --</option>';
          $.each(val, function(k, v){
            out += '<option value="'+k+'">'+k+' ('+v+')</option>';
          });
          $('#'+key).html(out).selectpicker('refresh');
        });
      }else if(type=="Subchapter"){
        data = JSON.parse(data);
        $.each(data, function(key, val){
          var out = '<option value=null>-- Please select '+key+' of interest --</option>';
          $.each(val, function(k, v){
            out += '<option value="'+k+'">'+k+' ('+v+')</option>';
          });
          $('#'+key).html(out).selectpicker('refresh');
        });
      }
    }
  });
}

function SelectEnter(ele){
  if(event.keyCode==13){
    var domain = $('#Domain').val();
    var chapter = $('#Chapter').val();
    var subchapter = $('#Subchapter').val();
    var trait = $('#Trait').val();
    var yearFrom = $('#yearFrom').val();
    var yearTo = $('#yearTo').val();
    var nMin = $('#nMin').val();
    var nMax = $('#nMax').val();
    if(yearFrom==""){yearFrom="null"}
    if(yearTo==""){yearTo="null"}
    if(nMin==""){nMin="null"}
    if(nMax==""){nMax="null"}

    TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax);
  }
}

function TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax){
  $('#dbTable').DataTable().destroy();
  selectTable = $('#dbTable').DataTable({
    processing: false,
    serverSide: false,
    select: true,
    autoWidth: false,
    "ajax" : {
      url: subdir+"/traitDB/dbTable",
      type: "POST",
      data: {
        domain: domain,
        chapter: chapter,
        subchapter: subchapter,
        trait: trait,
        yearFrom: yearFrom,
        yearTo: yearTo,
        nMin: nMin,
        nMax: nMax
      }
    },
    error: function(){

    },
    "columns":[
      {"data": "ID", name: "ID"},
      {"data": "PMID", name:"PMID"},
      {"data": "Year", name: "Year"},
      {"data": "Domain", name: "Domain"},
      {"data": "ChapterLevel", name: "Chapter level"},
      {"data": "SubchapterLevel", name: "Subchapter level"},
      {"data": "Trait", name: "Trait"},
      {"data": "Population", name: "Populaion"},
      {"data": "Ncase", name: "Case"},
      {"data": "Ncontrol", name: "Control"},
      {"data": "N", name: "N"},
      {"data": "Genome", name: "Genome"},
      {"data": "Nsnps", name: "Nsnps"},
      {"data": "Nhits", name: "Nhits"},
      {"data": "SNPh2", name: "SNP h2"},
      {"data": "File", name: "File"},
      {"data": "Website", name: "Web site"}
    ],
    columnDefs: [
      {width:"200px", target:4}
    ],
    // "columnDefs": [{
    //   "targets": -1,
    //   "data": null,
    //   "defaultContent": "<button>Delete</button>"
    // }],
    "lengthMenue": [[10, 25, 50, -1], [10, 25, 50, "All"]],
    "iDisplayLength": 10
  });
}
