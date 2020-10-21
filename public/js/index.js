$(document).ready(function() {
    $('#loading-image').hide();
    $('#fli-table').show();
    displayAgents();
    setInterval(updateAgentsTable, 5000);

    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
    const comparer = (idx, asc) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
    (getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        console.log('clicked');
        const table = th.closest('table');
        console.log(table);
        const tbody = table.querySelector('tbody');
        Array.from(tbody.querySelectorAll('tr'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => tbody.appendChild(tr));
            console.log('did this');
    })));

    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
      
        if (!th.className.includes('th-gen-active')) {
            th.parentElement.querySelectorAll('.th-gen-active').forEach(th => th.classList.replace('th-gen-active', 'th-gen'));
            th.classList.replace('th-gen', 'th-gen-active');
        }
           
        if(th.childNodes.length > 1) {
            if (th.childNodes[1].className.includes('glyphicon-arrow-down')) {
                th.childNodes[1].classList.replace('glyphicon-arrow-down', 'glyphicon-arrow-up');
            } else if (th.childNodes[1].className.includes('glyphicon-sort')) {
                th.childNodes[1].classList.replace('glyphicon-sort', 'glyphicon-arrow-down');
            } else {
                th.childNodes[1].classList.replace('glyphicon-arrow-up', 'glyphicon-arrow-down');
            }
        } else {
            th.innerHTML += ' <span class="glyphicon glyphicon-arrow-down"></span>';
        }

        th.parentElement.querySelectorAll('.th-gen').forEach(th => removeSpanClass(th));
    })));

   
});

function removeSpanClass(th) {
    if (th.className === 'th-gen' && th.childNodes.length > 1) {
        th.removeChild(th.childNodes[1]);
    }
}

function displayAgents() {
     $.ajax({
        url: 'http://10.28.101.19:3007/agents',
        dataType: 'json',
        beforeSend: function() {
            $('#loading-image').show();
        },
        complete: function() {
            $('#loading-image').hide();
        },
        success: function(response) {
            if(response.length !== 0) {
                var data = '';
                for(i = 0; i < response.length; i++) {
                  	if(response[i].loggedOn === 1) {
                        if (response[i].state == 'Logged On') {
                            if(response[i].dynamicState == 'Free') {
                                data += '<tr id="' + response[i].extension + '" class="springgreen">';
                            } else if(response[i].dynamicState == 'Out of service') {
                                data += '<tr id="' + response[i].extension + '" class="crimson">';
                            } else if (response[i].dynamicState.includes('call')) {
                                data += '<tr id="' + response[i].extension + '" class="deepskyblue">';
                            } else {
                                data += '<tr id="' + response[i].extension + '" class="darkorange">';
                            }
                        } else if (response[i].state == 'Unavailable') {
                            data += '<tr id="' + response[i].extension + '" class="darkorange">';
                        }
                    } else {
                            data += '<tr id="' + response[i].extension + '" class="crimson">';
                    }
                    data += '<td id="agentName">' + response[i].name + '</td>';
                    data += '<td id="agentExtension">' + response[i].extension + '</td>';
                    response[i].station === 0 ? data += '<td id="agentStation"></td>' : data += '<td id="agentStation">' + response[i].station + '</td>';
                    data += '<td id="agentPG">' + response[i].pg + '</td>';
                    data += '<td id="agentState">' + response[i].state + '</td>';
                    data += '<td id="agentWithdrawalType">' + response[i].withdrawal + '</td>';
                    data += '<td id="agentDynamicState">' + response[i].dynamicState + '</td>';
                    if(response[i].station !== 0) {
                        if (response[i].office === 0) {
                            console.log(response[i].name + ' Office No');
                            data += '<td id="agentOffice">No</td>';
                        } else if (response[i].office === 1) {
                            data += '<td id="agentOffice">Yes</td>';
                            console.log(response[i].name + ' Office Yes');
                        }
                    } else {
                        data += '<td id="agentOffice"></td>';
                        console.log(response[i].name + ' Office No Data');
                    }
                    data += '</tr>';
                }
                $('#tbody').append(data);
            }
        }
    });
}

function updateAgentsTable() {
     $.ajax({
        url: 'http://10.28.101.19:3007/agents',
        dataType: 'json',
        success: function(response) {
            for(i = 0; i < response.length; i++) {
                var agentExtension = response[i].extension;
                var agentStation = response[i].station;
                var agentPG = response[i].pg;
                var agentState = response[i].state;
                var agentWithdrawalType = response[i].withdrawal;
                var agentDynamicState = response[i].dynamicState;
                var agentOffice = response[i].office;
                var row = $('#' + agentExtension);
                var agentStationCol = row.find('#agentStation');
                var agentPGCol = row.find('#agentPG');
                var agentStateCol = row.find('#agentState');
                var agentWithdrawalTypeCol = row.find('#agentWithdrawalType');
                var agentDynamicStateCol = row.find('#agentDynamicState');
                var agentOfficeCol = row.find('#agentOffice');
                var agentOfficeBool;
                if(agentOffice === 0) {
                    agentOfficeBool = 'No'
                } else if(agentOffice === 1) {
                    agentOfficeBool = 'Yes'
                }
                if(agentStation !== agentStationCol.val() || agentStation === '') {
                    agentStationCol.text(agentStation);
                    if(agentOfficeBool !== agentOfficeCol.val() || agentOfficeBool === '') {
                        agentOfficeCol.text(agentOfficeBool);
                    }
                }
				if(agentStation === 0) {
                    agentStationCol.text('');
                    agentOfficeCol.text('');
				}
                if(agentPG !== agentPGCol.val() || agentPG === '') {
                    agentPGCol.text(agentPG);  
                }
                if(agentState !== agentStateCol.val()) {
                    agentStateCol.text(agentState);
                    if(agentState == 'Logged On') {
                        if(agentDynamicState == 'Free') {
                            row.removeClass();
                            row.addClass('springgreen')
                        } else if (agentDynamicState == 'Out of service') {
                            row.removeClass();
                            row.addClass('crimson');
                        } else if (agentDynamicState.includes('call')) {
                            row.removeClass();
                            row.addClass('deepskyblue');
                        } else {
                            row.removeClass();
                            row.addClass('darkorange');
                        }
                    } else if(agentState == 'Unavailable') {
                        row.removeClass();
                        row.addClass('darkorange');
                    } else {
                        row.removeClass();
                        row.addClass('crimson');
                    }
                }
                if(agentWithdrawalType !== agentWithdrawalTypeCol.val() || agentWithdrawalType === '') {
                    agentWithdrawalTypeCol.text(agentWithdrawalType);
                }
                if(agentDynamicState !== agentDynamicStateCol.val() || agentDynamicState === '') {
                    agentDynamicStateCol.text(agentDynamicState);
                }
                if(agentOffice == '') {
                    
                } else if(agentOffice === 0) {
                    agentOfficeCol.val() === 'No'
                } else if(agentOffice === 1) {
                    agentOfficeCol.val() === 'Yes'
                }
            }
        }
    });
}


