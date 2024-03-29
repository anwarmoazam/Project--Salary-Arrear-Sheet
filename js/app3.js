// Module for handling data manipulation
const dataModule = (function () {
    const npaRate = 20;
    const daRate = {}
    const data = JSON.parse(localStorage.getItem('data')) || {};


    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function daysRemainingInMonth(date) {
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return endDate.getDate() - (date.getDate() - 1);
    }

    function getDaRate(date) {
        let daRate = 0;
        date = new Date(date);
        if (date >= new Date(2017, 0, 1) && date <= new Date(2017, 5, 30)) {
            daRate = 4;
        } else if (date >= new Date(2017, 6, 1) && date <= new Date(2017, 11, 31)) {
            daRate = 5;
        } else if (date >= new Date(2018, 0, 1) && date <= new Date(2018, 5, 30)) {
            daRate = 7;
        } else if (date >= new Date(2018, 6, 1) && date <= new Date(2018, 11, 31)) {
            daRate = 9;
        } else if (date >= new Date(2019, 0, 1) && date <= new Date(2019, 5, 30)) {
            daRate = 12;
        } else if (date >= new Date(2019, 6, 1) && date <= new Date(2021, 5, 30)) {
            daRate = 17;
        } else if (date >= new Date(2021, 6, 1) && date <= new Date(2021, 11, 31)) {
            daRate = 31;
        } else if (date >= new Date(2022, 0, 1) && date <= new Date(2022, 5, 30)) {
            daRate = 34;
        } else if (date >= new Date(2022, 6, 1) && date <= new Date(2022, 11, 31)) {
            daRate = 38;
        } else if (date >= new Date(2023, 0, 1) && date <= new Date(2023, 5, 30)) {
            daRate = 42;
        } else {
            daRate = 42;
        }
        return daRate;
    }

    function getHraRate(date) {
        let hraRate = 0;
        date = new Date(date);
        if (date >= new Date(2017, 9, 1) && date <= new Date(2021, 6, 1)) {
            hraRate = 8;
        } else if (date >= new Date(2021, 6, 1)) {
            hraRate = 9;
        } else {
            hraRate = 0
        }
        return hraRate;
    }

    function getCurrentMonthAndYear(startDate, endDate) {
        let years = (new Date(endDate).getFullYear() - new Date(startDate).getFullYear());
        let months = (new Date(endDate).getMonth() - new Date(startDate).getMonth()) + (years * 12) + 1;

        let currentMonth = new Date(startDate).getMonth() + 1;
        let currentYear = new Date(startDate).getFullYear();

        let monthAndYear = [];
        for (let i = 0; i < months; i++) {
            let currentMonthAndYear = {};
            if (i === 0) {
                currentMonthAndYear.date = new Date(startDate).getDate();
                currentMonthAndYear.month = currentMonth;
                currentMonthAndYear.year = currentYear;
                currentMonthAndYear.days = daysRemainingInMonth(new Date(startDate));
                currentMonth++;
            } else if (i === months - 1) {
                currentMonthAndYear.date = new Date(endDate).getDate();
                currentMonthAndYear.month = currentMonth;
                currentMonthAndYear.year = currentYear;
                currentMonthAndYear.days = new Date(endDate).getDate();
            } else if (currentMonth === 12) {
                currentMonthAndYear.date = 1;
                currentMonthAndYear.month = currentMonth;
                currentMonthAndYear.year = currentYear;
                currentMonthAndYear.days = getDaysInMonth(currentMonth, currentYear);
                currentYear++;
                currentMonth = 1;
            } else {
                currentMonthAndYear.date = 1;
                currentMonthAndYear.month = currentMonth;
                currentMonthAndYear.year = currentYear;
                currentMonthAndYear.days = getDaysInMonth(currentMonth, currentYear);
                currentMonth++;
            }
            monthAndYear.push(currentMonthAndYear);
        }
        return monthAndYear;
    }

    function getMessAllowance(obj, amount1, amount2, amount3) {
        if (new Date(obj.year, obj.month) <= new Date(2022, 3, 1)) {
            return Math.round((amount1 / getDaysInMonth(obj.month, obj.year)) * obj.days);
        } else if (new Date(obj.year, obj.month) >= new Date(2022, 3, 1) && new Date(obj.year, obj.month) <= new Date(2023, 6, 1)) {
            return Math.round((amount2 / getDaysInMonth(obj.month, obj.year)) * obj.days);
        } else if (new Date(obj.year, obj.month) >= new Date(2023, 6, 1)) {
            return Math.round((amount3 / getDaysInMonth(obj.month, obj.year)) * obj.days);
        }
    }

    function getHdaAllowance(obj, amount1, amount2) {
        let date = new Date(2023, 6, 1);
        return (new Date(obj.year, obj.month) <= date) ? Math.round((amount1 / getDaysInMonth(obj.month, obj.year) * obj.days)) : Math.round((amount2 / getDaysInMonth(obj.month, obj.year) * obj.days));
    }

    function getWashingAllowance(obj, amount1, amount2) {
        if (new Date(obj.year, obj.month) >= new Date(2017, 0, 1) && new Date(obj.year, obj.month) <= new Date(2023, 6, 1)) {
            return Math.round((150 / getDaysInMonth(obj.month, obj.year)) * obj.days);
        } else if (new Date(obj.year, obj.month) >= new Date(2023, 6, 1)) {
            return Math.round((180 / getDaysInMonth(obj.month, obj.year)) * obj.days);
        }
    }

    function calculateData(allData, key) {
        const obj = allData[key];
        const { alreadyPaid, toBePaid, difference } = allData;
        console.log('Before',alreadyPaid,toBePaid,difference);
        console.log('After',alreadyPaid,toBePaid,difference);
        const basicSalaryPerDay = obj.type ? (data.ga55Salary / getDaysInMonth(obj.month, obj.year)).toFixed(2) : (data.salary / getDaysInMonth(obj.month, obj.year)).toFixed(2);
        const date = obj.year + "," + obj.month + "," + 1;
        obj.basicSalary = Math.round(basicSalaryPerDay * obj.days);
        obj.hraAmount !== undefined ? obj.hraAmount = Math.round((obj.basicSalary * getHraRate(date)) / 100) : 0;
        obj.npaAmount !== undefined ? obj.npaAmount = Math.round(obj.basicSalary * npaRate / 100) : 0;
        obj.washingAmount !== undefined ? obj.washingAmount = getWashingAllowance(obj, 150, 180) : 0;
        obj.messAmount !== undefined && obj.messAmount === '1200-1320-1450' ? obj.messAmount = getMessAllowance(obj, 1200, 1320, 1450) : obj.messAmount !== undefined && obj.messAmount === '800-880-970' ? obj.messAmount = getMessAllowance(obj, 800, 880, 970) : obj.messAmount !== undefined && obj.messAmount === '250-275-300' ? obj.messAmount = getMessAllowance(obj, 250, 275, 300) : 0;
        obj.hdaAmount !== undefined ? obj.hdaAmount = getHdaAllowance(obj, 200, 250) : 0;
        obj.other !== undefined ? obj.otherAmount = 0 : 0;
        obj.npaAmount !== undefined ? obj.daAmount = Math.round((obj.basicSalary + obj.npaAmount) * getDaRate(date) / 100) : obj.daAmount = Math.round(obj.basicSalary * getDaRate(date) / 100);
        obj.totalAmount = obj.basicSalary + obj.daAmount + (obj.hraAmount || 0) + (obj.npaAmount || 0) + (obj.washingAmount || 0) + (obj.messAmount || 0) + (obj.hdaAmount || 0) + (obj.otherAmount || 0);
        if (alreadyPaid && toBePaid && difference) {
            let keys = Object.keys(alreadyPaid);
            let a = { basicSalary: null, npaAmount: null, hraAmount: null, washingAmount: null, messAmount: null, hdaAmount: null, otherAmount: null, daAmount: null, totalAmount: null };
            for (let i = 0; i < keys.length; i++) {
                if(keys[i] in a){
                    difference[keys[i]] = alreadyPaid[keys[i]] - toBePaid[keys[i]];
                }
            }
        }
        return obj;
    }
    
    return {
        saveData: function (name, designation, empId, empPan, salary, npa, hra, washing, mess, hda, other, fromDate, toDate) {
            const totalData = getCurrentMonthAndYear(fromDate, toDate);

            data.name = name.trim();
            data.designation = designation.trim();
            data.empId = empId.trim();
            data.empPan = empPan.trim();
            data.salary = salary;
            data.npaAllowance = npa;
            data.houseRentAllowance = hra;
            data.washingAllowance = washing;
            data.messAllowance = mess;
            data.hardDutyAllowance = hda;
            data.other = other;
            data.fromDate = fromDate;
            data.toDate = toDate;
            data.salary = salary;
            data.arear = {};
            let toBePaid = [], alreadyPaid = [], difference = [];

            totalData.forEach((month, index) => {
                month.month === 7 && index !== 0 ? data.salary = Math.round((data.salary + (data.salary * 3 / 100)) / 100) * 100 : data.salary;
                month.basicSalary = data.salary;
                data.npaAllowance === 'yes' ? month.npaAmount = 0 : 0;
                data.houseRentAllowance === 'yes' ? month.hraAmount = 0 : 0;
                data.washingAllowance === 'yes' ? month.washingAmount = 0 : 0;
                data.messAllowance === '1200-1320-1450' ? month.messAmount = data.messAllowance : data.messAllowance === '800-880-970' ? month.messAmount = data.messAllowance : data.messAllowance === '250-275-300' ? month.messAmount = data.messAllowance : 0;
                data.hardDutyAllowance === 'yes' ? month.hdaAmount = 0 : 0;
                data.other === 'yes' ? month.otherAmount = 0 : 0;
                alreadyPaid.push(calculateData({ alreadyPaid: month }, "alreadyPaid"));
                if (month.month === 3) {
                    let surrender = { ...month };
                    surrender.basicSalary = 0;
                    surrender.daAmount = 0;
                    surrender.npaAmount ? surrender.npaAmount = 0 : 0;
                    surrender.hraAmount ? surrender.hraAmount = 0 : 0;
                    surrender.washingAmount ? surrender.washingAmount = 0 : 0;
                    surrender.messAmount ? surrender.messAmount = 0 : 0;
                    surrender.hdaAmount ? surrender.hdaAmount = 0 : 0;
                    surrender.totalSurrenderAmount = surrender.totalAmount;
                    surrender.totalSurrenderAmount = 0;
                    surrender.totalAmount = 0;
                    alreadyPaid.push(surrender);
                }
            })
            data.arear.alreadyPaid = alreadyPaid;
            toBePaid = structuredClone(alreadyPaid);
            for (let i = 0; i < toBePaid.length; i++) {
                toBePaid[i].type = 'To be paid';
            }
            data.arear.toBePaid = toBePaid;
            difference = structuredClone(alreadyPaid);
            let keys = { basicSalary: null, npaAmount: null, hraAmount: null, washingAmount: null, messAmount: null, hdaAmount: null, otherAmount: null, daAmount: null, totalAmount: null };
            for(let i=0; i<difference.length; i++){
                for(let key in difference[i]){
                    if(key in keys){
                        difference[i][key] = 0;
                    }
                }
            }
            data.arear.difference = difference;
            localStorage.setItem('data', JSON.stringify(data));
            return data;
        },
        getData: function () {
            return data;
        },
        deleteData: function (index) {
            data.splice(index, 1);
            localStorage.setItem('data', JSON.stringify(data));
        },
        updateData: function (obj, key) {
            return calculateData(obj, key);
        }
    }
})();

// Module for handling UI related tasks
const uiModule = (function () {
    const table = document.getElementById('output');
    const tableHeadData = document.querySelector('tHead');
    const tableBodyData = document.querySelector('tbody');
    const monthsName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function createTotal(columValue) {
        const keys = Object.keys(columValue.arear.alreadyPaid[0]);
        keys.splice(0, 4);
        const obj = {};
        keys.forEach(item => {
            obj[item] = columValue.arear.alreadyPaid.reduce((acc, curr) => {
                acc += curr[item];
                return acc;
            }, 0)
        })
        return obj;
    }

    function createHeading(headingValue) {
        const keys = Object.keys(headingValue.arear.alreadyPaid[0]);
        keys.splice(0, 4);
        let fromDate = new Date(headingValue.fromDate);
        let toDate = new Date(headingValue.toDate);
        fromDate = `${fromDate.getDate() < 10 ? `0${fromDate.getDate()}` : fromDate.getDate()}-${fromDate.getMonth() < 10 ? `0${fromDate.getMonth() + 1}` : fromDate.getMonth() + 1}-${fromDate.getFullYear()}`;
        toDate = `${toDate.getDate() < 10 ? `0${toDate.getDate()}` : toDate.getDate()}-${toDate.getMonth() < 10 ? `0${toDate.getMonth() + 1}` : toDate.getMonth() + 1}-${toDate.getFullYear()}`;

        return `<tr><th ${keys.length === 9 ? `colspan="31"` : keys.length === 8 ? `colspan="28"` : keys.length === 7 ? `colspan="25"` : keys.length === 6 ? `colspan="22"` : keys.length === 5 ? `colspan="19"` : keys.length === 4 ? `colspan="16"` : keys.length === 3 ? `colspan="13"` : ``}>Employee Name : ${headingValue.name} &emsp; | &emsp; Designation : ${headingValue.designation} &emsp; | &emsp; Employee ID : ${headingValue.empId} &emsp; | &emsp; Employee PAN No. : ${headingValue.empPan}  &emsp; | &emsp; Arear From : ${fromDate} to ${toDate}</th></tr>
        <tr><th rowspan="2">S.No.</th><th rowspan="2">Month / Year</th><th rowspan="2">Days</th><th ${keys.length === 9 ? `colspan="9"` : keys.length === 8 ? `colspan="8"` : keys.length === 7 ? `colspan="7"` : keys.length === 6 ? `colspan="6"` : keys.length === 5 ? `colspan="5"` : keys.length === 4 ? `colspan="4"` : keys.length === 3 ? `colspan="3"` : ``}>Pay to be Drawn</th><th ${keys.length === 9 ? `colspan="9"` : keys.length === 8 ? `colspan="8"` : keys.length === 7 ? `colspan="7"` : keys.length === 6 ? `colspan="6"` : keys.length === 5 ? `colspan="5"` : keys.length === 4 ? `colspan="4"` : keys.length === 3 ? `colspan="3"` : ``}>Pay Already Drawn (As per GA 55)</th><th ${keys.length === 9 ? `colspan="9"` : keys.length === 8 ? `colspan="8"` : keys.length === 7 ? `colspan="7"` : keys.length === 6 ? `colspan="6"` : keys.length === 5 ? `colspan="5"` : keys.length === 4 ? `colspan="4"` : keys.length === 3 ? `colspan="3"` : ``}>Difference Amount</th><th rowspan="2">Actions</th></tr>
        <tr><th>Basic Salary</th><th>DA Amount</th>${headingValue.npaAllowance === 'yes' ? `<th>NPA Amount</th>` : ``} ${headingValue.houseRentAllowance === 'yes' ? `<th>HRA Amount</th>` : ``} ${headingValue.washingAllowance === 'yes' ? `<th>Washing Allowance Amount</th>` : ``} ${headingValue.messAllowance !== '0' ? `<th>Mess Amount</th>` : ``}${headingValue.hardDutyAllowance === 'yes' ? `<th>HDA Amount</th>` : ``}${headingValue.other === 'yes' ? `<th>Other Amount</th>` : ``}<th>Total Amount</th><th>Basic Salary</th><th>DA Amount</th>${headingValue.npaAllowance === 'yes' ? `<th>NPA Amount</th>` : ''}${headingValue.houseRentAllowance === 'yes' ? `<th>HRA Amount</th>` : ``}${headingValue.washingAllowance === 'yes' ? `<th>Washing Allowance Amount</th>` : ``}${headingValue.messAllowance !== '0' ? `<th>Mess Amount</th>` : ``}${headingValue.hardDutyAllowance === 'yes' ? `<th>HDA Amount</th>` : ``}${headingValue.other === 'yes' ? `<th>Other Amount</th>` : ``}<th>Total Amount</th><th>Basic Salary</th><th>DA Amount</th>${headingValue.npaAllowance === 'yes' ? `<th>NPA Amount</th>` : ''}${headingValue.houseRentAllowance === 'yes' ? `<th>HRA Amount</th>` : ``}${headingValue.washingAllowance === 'yes' ? `<th>Washing Allowance Amount</th>` : ``}${headingValue.messAllowance !== '0' ? `<th>Mess Amount</th>` : ``}${headingValue.hardDutyAllowance === 'yes' ? `<th>HDA Amount</th>` : ``}${headingValue.other === 'yes' ? `<th>Other Amount</th>` : ``}<th>Total Amount</th></tr>`;
    }

    return {
        getDOM: function () {
            return {
                name: document.getElementById('name').value,
                designation: document.getElementById('designation').value,
                empId: document.getElementById('empId').value,
                empPan: document.getElementById('pan').value,
                salary: Number(document.getElementById('salary').value),
                npa: document.getElementById('npa').value,
                hra: document.getElementById('hra').value,
                washing: document.getElementById('washing').value,
                mess: document.getElementById('mess').value,
                hda: document.getElementById('hda').value,
                other: document.getElementById('other').value,
                fromDate: document.getElementById('fromDate').value,
                toDate: document.getElementById('toDate').value,
            };
        },
        addRow: function (entry, index, otherData = {}) {
            table.innerHTML = "";
            const row = document.createElement('tr');
            row.id = `row-${index}`;
            row.innerHTML += `
                    <td></td>
                    ${entry.totalSurrenderAmount !== undefined ? `<td style="background-color : yellow" colspan="2">Surrender</td>` : `<td class="month-year">${monthsName[entry.month]} / ${entry.year}</td>`} 
                    ${entry.totalSurrenderAmount !== undefined ? '' : `<td>${entry.days}</td>`}

                    <td><input type="number" placeholder=${entry.basicSalary} class="salary-auto"></td>
                    <td>${entry.daAmount}</td>
                    ${entry.npaAmount !== undefined ? `<td>${entry.npaAmount}</td>` : ``}
                    ${entry.hraAmount !== undefined ? `<td>${entry.hraAmount}</td>` : ``}
                    ${entry.washingAmount !== undefined ? `<td>${entry.washingAmount}</td>` : ``}
                    ${entry.messAmount !== undefined ? `<td>${entry.messAmount}</td>` : ``}
                    ${entry.hdaAmount !== undefined ? `<td>${entry.hdaAmount}</td>` : ``}
                    ${entry.otherAmount !== undefined ? `<td><input type="number" placeholder=${entry.otherAmount} class="other-amount"></td>` : ``}
                    <td>${entry.totalAmount !== undefined ? entry.totalAmount : entry.totalSurrenderAmount}</td>

                    <td><input type="number" placeholder=${otherData.toBePaid.basicSalary} class="salary-ga55"></td>
                    <td><input type="number" placeholder=${otherData.toBePaid.daAmount}></td>
                    ${otherData.toBePaid.npaAmount !== undefined ? `<td><input type="number" placeholder=${otherData.toBePaid.npaAmount}></td>` : ''}
                    ${otherData.toBePaid.hraAmount !== undefined ? `<td><input type="number" placeholder=${otherData.toBePaid.hraAmount}></td>` : ``}
                    ${otherData.toBePaid.washingAmount !== undefined ? `<td><input type="number" placeholder=${otherData.toBePaid.washingAmount}></td>` : ''}
                    ${otherData.toBePaid.messAmount !== undefined ? `<td><input type="number" placeholder=${otherData.toBePaid.messAmount}></td>` : ''}
                    ${otherData.toBePaid.hdaAmount !== undefined ? `<td><input type="number" placeholder=${otherData.toBePaid.hdaAmount}></td>` : ``}
                    ${otherData.toBePaid.otherAmount !== undefined ? `<td><input type="number" placeholder=${otherData.toBePaid.otherAmount}></td>` : ``}
                    ${`<td>${otherData.toBePaid.totalAmount}</td>`}

                    <td>${otherData.difference.basicSalary}</td>
                    <td>${otherData.difference.daAmount}</td>
                    ${otherData.difference.npaAmount !== undefined ? `<td>${otherData.difference.npaAmount}</td>` : ``}
                    ${otherData.difference.hraAmount !== undefined ? `<td>${otherData.difference.hraAmount}</td>` : ``}
                    ${otherData.difference.washingAmount !== undefined ? `<td>${otherData.difference.washingAmount}</td>` : ``}
                    ${otherData.difference.messAmount !== undefined ? `<td>${otherData.difference.messAmount}</td>` : ``}
                    ${otherData.difference.hdaAmount !== undefined ? `<td>${otherData.difference.hdaAmount}</td>` : ``}
                    ${otherData.difference.otherAmount !== undefined ? `<td>${otherData.difference.otherAmount}</td>` : ``}
                    <td>${otherData.difference.totalAmount !== undefined ? otherData.difference.totalAmount : otherData.difference.totalSurrenderAmount}</td>
                    <td><button class="edit-btn">Edit</button><button class="delete-btn" data-id="${row.id}">Delete</button></td>`;
            tableBodyData.appendChild(row);
        },

        deleteRow: function (id) {
            const row = document.getElementById(id);
            tableBodyData.removeChild(row);
        },
        populateTable: function () {
            const totalRow = document.createElement('tr');
            totalRow.classList.add('total');
            table.innerHTML = "";
            let heading;
            tableHeadData.innerHTML = "";
            tableBodyData.innerHTML = "";
            const arearData = JSON.parse(localStorage.getItem('data')) || {};
            (Object.keys(arearData).length !== 0) ? heading = createHeading(arearData) : '';
            tableHeadData.innerHTML = heading;
            if (Object.keys(arearData).length !== 0) {
                const row = document.createElement('tr');
                row.innerHTML = arearData.arear.alreadyPaid.forEach((item, index) => {
                    this.addRow(item, index, { toBePaid: arearData.arear.toBePaid[index], difference: arearData.arear.difference[index] });
                });
                const total = createTotal(arearData);
                totalRow.innerHTML = `<td colspan="3">Total</td><td>${total.basicSalary}</td><td>${Math.round(total.daAmount)}</td>${total.npaAmount !== undefined ? `<td>${total.npaAmount}</td>` : ``}${total.hraAmount !== undefined ? `<td>${total.hraAmount}</td>` : ``}${total.washingAmount !== undefined ? `<td>${total.washingAmount}</td>` : ``}${total.messAmount !== undefined ? `<td>${total.messAmount}</td>` : ``}${total.hdaAmount !== undefined ? `<td>${total.hdaAmount}</td>` : ``}${total.otherAmount !== undefined ? `<td>${total.otherAmount}</td>` : ``}<td>${Math.round(total.totalAmount)}</td><td>${total.basicSalary}</td><td>${total.daAmount}</td>${total.npaAmount !== undefined ? `<td>${total.npaAmount}</td>` : ``}${total.hraAmount !== undefined ? `<td>${total.hraAmount}</td>` : ``}${total.washingAmount !== undefined ? `<td>${total.washingAmount}</td>` : ``}${total.messAmount !== undefined ? `<td>${total.messAmount}</td>` : ``}${total.hdaAmount !== undefined ? `<td>${total.hdaAmount}</td>` : ``}${total.otherAmount !== undefined ? `<td>${total.otherAmount}</td>` : ``}<td>${total.totalAmount}</td><td>${total.basicSalary}</td><td>${total.daAmount}</td>${total.npaAmount !== undefined ? `<td>${total.npaAmount}</td>` : ``}${total.hraAmount !== undefined ? `<td>${total.hraAmount}</td>` : ``}${total.washingAmount !== undefined ? `<td>${total.washingAmount}</td>` : ``}${total.messAmount !== undefined ? `<td>${total.messAmount}</td>` : ``}${total.hdaAmount !== undefined ? `<td>${total.hdaAmount}</td>` : ``}${total.otherAmount !== undefined ? `<td>${total.otherAmount}</td>` : ``}<td>${total.totalAmount}</td><td></td>`
            }
            tableBodyData.appendChild(totalRow);
            table.append(tableHeadData, tableBodyData);
        }
    }
})();

// Main App Module for integrating different modules
const appModule = (function (dataCtrl, uiCtrl) {
    uiCtrl.populateTable();
    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault();
        const inputData = uiCtrl.getDOM();
        const newData = dataCtrl.saveData(inputData.name, inputData.designation, inputData.empId, inputData.empPan, inputData.salary, inputData.npa, inputData.hra, inputData.washing, inputData.mess, inputData.hda, inputData.other, inputData.fromDate, inputData.toDate);
        uiCtrl.populateTable();
    });
    document.querySelector('tbody').addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const row = event.target.parentElement.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            uiCtrl.deleteRow(event.target.dataset.id);
            // dataCtrl.deleteData(index);
        }
    });
    document.querySelector('tbody').addEventListener('dblclick', function (event) {
        if (event.target.classList.contains('month-year')) {
            const row = event.target.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            const data = dataCtrl.getData();
            const obj = (data.arear.alreadyPaid[index].date !== 1) ? { ...data.arear.alreadyPaid[index + 1] } : { ...data.arear.alreadyPaid[index] };
            let surrenderIndex = data.arear.alreadyPaid.indexOf(data.arear.alreadyPaid.find((item, idx) => item.totalSurrenderAmount !== undefined && idx > index), index);

            if (surrenderIndex >= 0) {
                data.arear.alreadyPaid[surrenderIndex].basicSalary = Math.round(obj.basicSalary / 2);
                data.arear.alreadyPaid[surrenderIndex].daAmount = Math.round(obj.daAmount / 2);
                obj.washingAmount ? data.arear.alreadyPaid[surrenderIndex].washingAmount = 0 : 0;
                obj.npaAmount ? data.arear.alreadyPaid[surrenderIndex].npaAmount = Math.round(obj.npaAmount / 2) : 0;
                data.arear.alreadyPaid[surrenderIndex].totalSurrenderAmount = data.arear.alreadyPaid[surrenderIndex].basicSalary + data.arear.alreadyPaid[surrenderIndex].daAmount + (data.arear.alreadyPaid[surrenderIndex].npaAmount || 0);
                data.arear.alreadyPaid[surrenderIndex].totalAmount = data.arear.alreadyPaid[surrenderIndex].basicSalary + data.arear.alreadyPaid[surrenderIndex].daAmount + (data.arear.alreadyPaid[surrenderIndex].npaAmount || 0);
            }
            localStorage.setItem('data', JSON.stringify(data));
            uiCtrl.populateTable();
        }
    });
    document.querySelector('tbody').addEventListener('change', function (event) {
        if (event.target.classList.contains('salary-auto')) {
            const row = event.target.parentElement.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            const data = dataCtrl.getData();
            const newSalary = Number(event.target.value);
            data.salary = newSalary;
            for (let i = index; i < data.arear.alreadyPaid.length; i++) {
                if (data.arear.alreadyPaid[i].totalSurrenderAmount === undefined) {
                    data.arear.alreadyPaid[i].basicSalary = newSalary;
                    // data.arear.toBePaid[i].basicSalary = newSalary;
                    dataCtrl.updateData({ alreadyPaid: data.arear.alreadyPaid[i], toBePaid: data.arear.toBePaid[i], difference: data.arear.difference[i] }, "alreadyPaid");
                }
                if (data.arear.alreadyPaid[i].month === 7 && i !== index) {
                    data.salary = Math.round((data.salary + (data.salary * 3 / 100)) / 100) * 100;
                    dataCtrl.updateData({ alreadyPaid: data.arear.alreadyPaid[i], toBePaid: data.arear.toBePaid[i], difference: data.arear.difference[i] }, "alreadyPaid");
                }
            }
            data.arear.toBePaid = structuredClone(data.arear.alreadyPaid);
            localStorage.setItem('data', JSON.stringify(data));
            uiCtrl.populateTable();
        }
        if (event.target.classList.contains('salary-ga55')) {
            const row = event.target.parentElement.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            const ga55Data = structuredClone(dataCtrl.getData());
            const data = dataCtrl.getData();
            let newSalary = Number(event.target.value);
            data.ga55Salary = newSalary;
            const _toBePaid = structuredClone(ga55Data.arear.toBePaid);
            delete ga55Data.arear.toBePaid;
            ga55Data.ga55Salary = newSalary;
            for (let i = index; i < _toBePaid.length; i++) {
                if (_toBePaid[i].totalSurrenderAmount === undefined) {
                    _toBePaid[i].basicSalary = ga55Data.ga55Salary;
                    dataCtrl.updateData({ alreadyPaid: ga55Data.arear.alreadyPaid[i], toBePaid: _toBePaid[i], difference: ga55Data.arear.difference[i] }, "toBePaid");
                }
                if (_toBePaid[i].month === 7 && i !== index) {
                    newSalary = Math.round((newSalary + (newSalary * 3 / 100)) / 100) * 100;
                    ga55Data.ga55Salary = newSalary;
                    _toBePaid[i].basicSalary = ga55Data.ga55Salary;
                    dataCtrl.updateData({ alreadyPaid: ga55Data.arear.alreadyPaid[i], toBePaid: _toBePaid[i], difference: ga55Data.arear.difference[i] }, "toBePaid");
                }
            }
            ga55Data.arear.toBePaid = structuredClone(_toBePaid);
            localStorage.setItem('data', JSON.stringify(ga55Data));
            uiCtrl.populateTable();
        }
        if (event.target.classList.contains('other-amount')) {
            const row = event.target.parentElement.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            const data = dataCtrl.getData();
            const value = Number(event.target.value);
            data.arear.alreadyPaid[index].otherAmount = value;
            data.arear.alreadyPaid[index].totalAmount += value;
            localStorage.setItem('data', JSON.stringify(data));
            uiCtrl.populateTable();
        }
    });
})(dataModule, uiModule);