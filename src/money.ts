import {BigNumber} from "@co.mmons/js-utils/core";
import {Currency} from "./currency";

function toBigNumber(value: number | BigNumber | string | any): BigNumber {

    if (value instanceof BigNumber) {
        return value;
    } else if (typeof value === "number") {
        return new BigNumber(value);
    } else if (typeof value === "string") {
        return new BigNumber(value);
    } else {
        throw "Given value: " + value + " cannot be converted to BigNumber.";
    }
}

export class Money {

    constructor(currency: Currency, amount: BigNumber | number);

    constructor(currency: string, amount: BigNumber | number);

    constructor(currencyOrPrototype: Currency | string | any, amount?: number | BigNumber | string | number) {

        if (currencyOrPrototype instanceof Currency || typeof currencyOrPrototype === "string") {
            this.currency = currencyOrPrototype instanceof Currency ? currencyOrPrototype : new Currency(currencyOrPrototype);
            this.amount = toBigNumber(amount);

        } else if (currencyOrPrototype) {
    
            this.amount = toBigNumber(currencyOrPrototype["amount"]);
            this.currency = currencyOrPrototype["currency"] instanceof Currency ? currencyOrPrototype["amount"] : new Currency(currencyOrPrototype["currency"]);
        }
    }

    readonly currency: Currency;

    readonly amount: BigNumber;

    plus(amount: BigNumber | number | string): Money {
        return new Money(this.currency, this.amount.plus(amount));
    }

    minus(amount: BigNumber | number | string): Money {
        return new Money(this.currency, this.amount.minus(amount));
    }

    times(amount: BigNumber | number | string): Money {
        return new Money(this.currency, this.amount.times(amount));
    }

    dividedBy(amount: BigNumber | number | string): Money {
        return new Money(this.currency, this.amount.dividedBy(amount));
    }

    decimalPlaces(dp: number, roundingMode: BigNumber.RoundingMode): Money {
        return new Money(this.currency, this.amount.decimalPlaces(dp, roundingMode));
    }

    comparedTo(money: Money | BigNumber | number): number {
        return this.compareTo(money);
    }

    compareTo(money: Money | BigNumber | number): number {
        if (typeof money === "number") return this.amount.comparedTo(money);
        else if (money instanceof BigNumber) return this.amount.comparedTo(money);
        else if (money) return this.amount.comparedTo(money.amount);
        else throw new Error("Cannot compare empty value");
    }

    toJSON() {
        return [this.currency.code, this.amount.toString()];
    }

    protected fromJSON(json: any) {

        if (typeof json == "string") {
            let currency = json.substr(0, 3);
            let amount = json.substr(3);
            this.constructor.call(this, currency, amount);
            return;

        } else if (Array.isArray(json)) {
            if (json.length == 2 && typeof json[0] == "string" && (typeof json[1] == "string" || typeof json[1] == "number")) {
                let currency = json[0];
                let amount = json[1];
                this.constructor.call(this, currency, amount);
                return;
            }
            
        } else if (json.currency && json.amount) {
            this.constructor.call(this, json);
            return;
        }

        throw new Error("Cannot unserialize  '" + json + "' to Money");
    }

    toString() {
        return this.currency.code + this.amount.toString();
    }
}
