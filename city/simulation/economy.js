// City treasury. All rates are per 10 simulated seconds (one abstract fiscal period).
export class CityEconomy {
  constructor(initialCash=0){this.cash=initialCash;this.debt=0;this.taxRate=9;this.last={tax:0,commercial:0,industrial:0,office:0,upkeep:0,interest:0,net:0};}
  borrow(amount=10000){if(amount<=0||this.debt>=100000)return false;const accepted=Math.min(amount,100000-this.debt);this.cash+=accepted;this.debt+=accepted;return accepted;}
  settle(population,buildings,serviceCount=0){
    const count=t=>buildings.filter(b=>b.type===t).length;
    const tax=population*this.taxRate*.04,commercial=count('com')*35,industrial=count('ind')*45,office=count('off')*50;
    const upkeep=buildings.length*3+serviceCount*8,interest=this.debt*.0002,repayment=Math.min(this.debt,Math.max(0,this.cash+tax+commercial+industrial+office-upkeep-interest)*.01);
    const net=tax+commercial+industrial+office-upkeep-interest-repayment;
    this.cash+=net;this.debt-=repayment;
    this.last={tax,commercial,industrial,office,upkeep,interest,repayment,net};
    return this.cash;
  }
}
