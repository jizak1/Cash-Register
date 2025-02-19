let price = 19.5;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

const CURRENCY_UNIT = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.1,
    "QUARTER": 0.25,
    "ONE": 1,
    "FIVE": 5,
    "TEN": 10,
    "TWENTY": 20,
    "ONE HUNDRED": 100
};

document.getElementById('purchase-price').textContent = price.toFixed(2);


function updateDrawerDisplay() {
    const drawerDisplay = document.getElementById('drawer-display');
    drawerDisplay.innerHTML = cid.map(([unit, amount]) => 
        `<div>${unit}: $${amount.toFixed(2)}</div>`
    ).join('');
}


function calculateChange(price, cash, cid) {
    let changeDue = cash - price;
    const originalChangeDue = changeDue;
    let totalCid = cid.reduce((sum, [, amount]) => sum + amount, 0);
    

    if (changeDue === 0) {
        return { status: "EXACT", change: [] };
    }
    
   
    if (totalCid < changeDue) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }
    

    const change = [];
    [...cid].reverse().forEach(([unit, amount]) => {
        const unitValue = CURRENCY_UNIT[unit];
        let unitAmount = 0;
        
        while (changeDue >= unitValue && amount > 0) {
            changeDue = Math.round((changeDue - unitValue) * 100) / 100;
            amount = Math.round((amount - unitValue) * 100) / 100;
            unitAmount = Math.round((unitAmount + unitValue) * 100) / 100;
        }
        
        if (unitAmount > 0) {
            change.push([unit, unitAmount]);
        }
    });
    

    if (changeDue > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }
    
    if (Math.abs(totalCid - originalChangeDue) < 0.01) {
        return { status: "CLOSED", change: cid };
    }
    
    return { status: "OPEN", change };
}

document.getElementById('purchase-btn').addEventListener('click', () => {
    const cashInput = document.getElementById('cash');
    const changeDisplay = document.getElementById('change-due');
    const cash = parseFloat(cashInput.value);

    if (isNaN(cash)) {
        alert("Please enter a valid amount");
        return;
    }

    if (cash < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    if (cash === price) {
        changeDisplay.textContent = "No change due - customer paid with exact cash";
        return;
    }

    const result = calculateChange(price, cash, cid);
    
    if (result.status === "INSUFFICIENT_FUNDS") {
        changeDisplay.textContent = "Status: INSUFFICIENT_FUNDS";
    } else if (result.status === "CLOSED") {
        const changeString = result.change
            .filter(([, amount]) => amount > 0)
            .map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`)
            .join(' ');
        changeDisplay.textContent = `Status: CLOSED ${changeString}`;
    } else {
        const changeString = result.change
            .filter(([, amount]) => amount > 0)
            .map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`)
            .join(' ');
        changeDisplay.textContent = `Status: OPEN ${changeString}`;
    }
});
updateDrawerDisplay();