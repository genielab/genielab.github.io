$(document).ready(function() {
    $('table.display').dataTable( {
        responsive: true,
        "columnDefs": [ {
            "targets": "_all",
            "render": function ( data, type, row, meta ) {
                return type === 'display' && data.length > 10 ?
                    '<span title="'+data+'">'+data.substr( 0, 10 )+'...</span>' :
                    data;
            }
        } ]
    } );
});