export class EatsDate {
    epochSecond: bigint;
    nano: bigint;

    constructor(input:any) {
        this.epochSecond = input.epochSecond;
        this.nano = input.nano;
    }

    public toDate() : Date {
        if(this.epochSecond === BigInt(0))
            return null;
        else 
            return new Date(Number(this.epochSecond) * 1000);
    }
}
