let now = new Date();
let mysqlTime = now.toISOString().slice(0,19).replace('T', ' ');

console.log(mysqlTime);
