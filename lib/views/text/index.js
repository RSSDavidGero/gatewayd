var Table = require('cli-table');
var _ = require('underscore-node');

function printTrustLinesTable(lines) {
  var table = new Table({
    head: ['Account', 'Currency', 'Limit'],
    colWidths: [40, 10, 20]
  });
  _.each(lines, function(line) {
    table.push([
      line.counterparty,
      line.currency,
      line.limit
    ]);
  });
  logger.info(table.toString());
}

function printPaymentsTable(payments) {
  var table = new Table({
    head: ['#', 'Address Id', 'Amount', 'Currency'],
    colWidths: [8, 8, 10, 10]
  });
  for (var i=0; i<payments.length; i++){
    var payment = payments[i];
    table.push([
      payment.id,
      payment.to_address_id,
      payment.to_amount,
      payment.to_currency,
    ]);
  }
  logger.info(table.toString());
}

function printRippleAddressesTable(addresses) {
  var table = new Table({
    head: ['#', 'User Id', 'Managed', 'Type', 'Tag', 'Created At'],
    colWidths: [10, 10, 10, 15, 10, 40]
  });
  for (var i=0; i<addresses.length; i++){
    var address = addresses[i];
    table.push([
      address.id,
      address.user_id,
      address.managed,
      address.type,
      address.tag || '',
      address.createdAt
    ]);
  }
  logger.info(table.toString());
}

function printExternalAccountsTable(accounts) {
  var table = new Table({
    head: ['#', 'User Id', 'Name'],
    colWidths: [10, 10, 40]
  });
  for (var i=0; i<accounts.length; i++){
    var account = accounts[i];
    table.push([
      account.id,
      account.user_id,
      account.name
    ]);
  }
  logger.info(table.toString());
}

function printUsersTable(users) {
  var table = new Table({
    head: ['#', 'Name', 'Created At'],
    colWidths: [10, 40, 40]
  });
  for (var i=0; i<users.length; i++){
    var user = users[i];
    table.push([
      user.id,
      user.name,
      user.createdAt,
    ]);
  }
  logger.info(table.toString());
}

function printExternalTransactionsTable(transactions) {
  var table = new Table({
    head: ['#', 'Created', 'Amount', 'Currency', 'Account Id'],
    colWidths: [10, 30, 10, 10, 15]
  });
  for (var i=0; i<transactions.length; i++){
    var transaction = transactions[i];
    table.push([
      transaction.id,
      transaction.createdAt,
      transaction.amount,
      transaction.currency,
      transaction.external_account_id
    ]);
  }
  logger.info(table.toString());
}

function printClearedTransactions(transactions){
  var table = new Table({
    head: ['#', 'Created', 'Amount', 'Currency', 'Account Id'],
    colWidths: [10, 30, 10, 10, 15]
  });

  for (var i=0; i<transactions.length; i++){
    var transaction = transactions[i];
    table.push([
      transaction.id,
      transaction.createdAt,
      transaction.amount,
      transaction.currency,
      transaction.external_account_id
    ]);
  }
  logger.info(table.toString());
}

function printAccountBalance(balances){
  var table = new Table({
    head: ['Currency', 'Amount', 'Counterparty'],
    colWidths: [30, 10, 40]
  });
  for (var i=0; i<balances.length; i++) {
    var balance = balances[i];
    table.push([
      balance.currency,
      balance.value,
      balance.counterparty
    ]);
  }
  logger.info(table.toString());
}

module.exports = {
  payments: printPaymentsTable,
  rippleAddresses: printRippleAddressesTable,
  externalAccounts: printExternalAccountsTable,
  users: printUsersTable,
  externalTransactions: printExternalTransactionsTable,
  clearedTransactions: printClearedTransactions,
  trustLines: printTrustLinesTable,
  balances: printAccountBalance
};
