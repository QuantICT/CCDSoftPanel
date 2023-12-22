$(document).ready(() => {

	let year = new Date().getFullYear();
	$('#year').text(year + " ");

	$('#loading-image').hide();
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

const removeSpanClass = th => {
	if (th.className === 'th-gen' && th.childNodes.length > 1) {
		th.removeChild(th.childNodes[1]);
	}
}

const displayAgents = () => {
	$.ajax({
		url: 'http://10.28.101.19:3007/agents',
		dataType: 'json',
		beforeSend: () => {
			$('#loading-image').show();
		},
		complete: () => {
			$('#loading-image').hide();
		},
		success: (res) => {
			if (res.length !== 0) {
				
				for(i = 0; i < res.length; i++) {
					let trEl = document.createElement('tr');
					trEl.classList.add('fade-in');
					trEl.id = res[i].extension;
					if (res[i].loggedOn === 1) {
						if (res[i].state === 'Logged On') {
							if (res[i].dynamicState === 'Free') {
								trEl.classList.add('darkgreen');
							} else if (res[i].dynamicState === 'Out of service') {
								trEl.classList.add('crimson');
							} else if (res[i].dynamicState === 'In conversation') {
								trEl.classList.add('deepskyblue');
							} else if (res[i].dynamicState === 'Ringing') {
								trEl.classList.add('deeppink');
							} else {
								trEl.classList.add('darkorange');
							}
						} else if (res[i].state === 'Unavailable') {
							if (res[i].dynamicState === 'In conversation') {
								trEl.classList.add('deepskyblue');
							} else if (res[i].dynamicState === 'Ringing') {
								trEl.classList.add('deeppink');
							} else {
								trEl.classList.add('darkorange');
              				}
						}
					} else {
						trEl.classList.add('crimson');
					}
					let tdArray = [];
					let tdElAgentName = document.createElement('td');
					tdElAgentName.className = 'agentName';
					tdElAgentName.innerText = res[i].name;
					trEl.appendChild(tdElAgentName);
					let tdElAgentExtension = document.createElement('td');
					tdElAgentExtension.className = 'agentExtension';
					tdElAgentExtension.innerText = res[i].extension;
					trEl.appendChild(tdElAgentExtension);
					let tdElAgentStation = document.createElement('td');
					tdElAgentStation.className = 'agentStation';
					res[i].station === 0 ? tdElAgentStation.innerText = '' : tdElAgentStation.innerText = res[i].station;
					trEl.appendChild(tdElAgentStation);
					let tdElAgentPG = document.createElement('td');
					tdElAgentPG.className = 'agentPG';
					tdElAgentPG.innerText = res[i].pg;
					trEl.appendChild(tdElAgentPG);
					let tdElAgentState = document.createElement('td');
					tdElAgentState.className = 'agentState';
					tdElAgentState.innerText = res[i].state;
					trEl.appendChild(tdElAgentState);
					let tdElAgentWithdrawalType = document.createElement('td');
					tdElAgentWithdrawalType.className= 'agentWithdrawalType';
					tdElAgentWithdrawalType.innerText = res[i].withdrawal;
					trEl.appendChild(tdElAgentWithdrawalType);
					let tdElAgentDynamicState = document.createElement('td');
					tdElAgentDynamicState.className = 'agentDynamicState';
					tdElAgentDynamicState.innerText = res[i].dynamicState;
					trEl.appendChild(tdElAgentDynamicState);
					let tdElAgentOffice = document.createElement('td');
					tdElAgentOffice.className = 'agentOffice';
					if (res[i].station !== 0) {
						if (res[i].office === 0) {
							tdElAgentOffice.innerText = 'No';
						} else if (res[i].office === 1) {
							tdElAgentOffice.innerText = 'Yes';
						}
					} else {
						tdElAgentOffice.innerText = '';
					}
					trEl.appendChild(tdElAgentOffice);

					document.getElementById('tbody').appendChild(trEl);
				}
			}
		}
	});
}

const updateAgentsTable = () => {
	$.ajax({
    	url: 'http://10.28.101.19:3007/agents',
		dataType: 'json',
		success: (res) => {
			for (i = 0; i < res.length; i++) {
				// console.log(res[i]);
				let agentOfficeText;
				const row = $('#' + res[i].extension);
				
				if (res[i].station !== row.find('.agentStation').val() || res[i].station === '') {
					row.find('.agentStation').text(res[i].station);
				}
				if (res[i].station === 0) {
					row.find('.agentStation').text('');
					row.find('.agentOffice').text;
				}
				if (res[i].state !== row.find('.agentState').val()) {
					row.find('.agentState').text(res[i].state);
					if (res[i].state === 'Logged On') {
						if (res[i].dynamicState == 'Free') {
							row.removeClass();
							row.addClass('darkgreen fade-in');
						} else if (res[i].dynamicState === 'Out of service') {
							row.removeClass();
              				row.addClass('crimson fade-in');
						} else if (res[i].dynamicState === 'In conversation') {
							row.removeClass();
              				row.addClass('deepskyblue fade-in');
						} else if (res[i].dynamicState === 'Ringing') {
							row.removeClass();
							row.addClass('deeppink fade-in');
            			} else {
							row.removeClass();
              				row.addClass('darkorange fade-in');
						}
					} else if (res[i].state === 'Unavailable'){
						if (res[i].dynamicState === 'In conversation') {
							row.removeClass();
              				row.addClass('deepskyblue fade-in');
						} else if (res[i].dynamicState === 'Ringing') {
							row.removeClass();
							row.addClass('deeppink fade-in');
            			} else {
							row.removeClass();
							  row.addClass('darkorange fade-in');
						}
					} else if (res[i].state === 'Logged Off'){
						row.removeClass();
           				row.addClass('crimson fade-in');
					}
				}
				row.find('.agentPG').text(updateRow(res[i].pg, row.find('.agentPG')));
				row.find('.agentWithdrawalType').text(updateRow(res[i].withdrawal, row.find('.agentWithdrawalType')));
				row.find('.agentDynamicState').text(updateRow(res[i].dynamicState, row.find('.agentDynamicState')));
				
				if(res[i].state === 'Logged Off') {
					row.find('.agentOffice').text('');
				} else if(res[i].state === 'Logged On' || res[i].state === 'Unavailable') {
					if(res[i].office === 0) {
						row.find('.agentOffice').text('No')
					} else {
						row.find('.agentOffice').text('Yes');
					}
				}
			}
		}
  });
}

const updateRow = (ajaxData, rowData) => {
	if (ajaxData !== rowData || ajaxData === '') {
		return ajaxData;
	} else {
		return rowData
	}
}
