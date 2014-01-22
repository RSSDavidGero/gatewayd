ExternalTransaction = require("../models/external_transaction.js");
User = require('../models/user.js');

module.exports = (function(){

  function create(req, res) {
    req.checkBody('cash_amount', 'invalid cash_amount').notEmpty();
    req.checkBody('currency', 'invalid currency').notEmpty();
    req.checkBody('external_account_id', 'invalid external_account_id').notEmpty();
    req.checkBody('deposit', 'invalid deposit boolean').notEmpty();
    req.checkBody('user_id', 'invalid user_id').notEmpty();
    if (errors = req.validationErrors()) { 
      res.send({ error: errors }); return;
    }
   
    ExternalTransaction.create({
      deposit: req.body.deposit,
      currency: req.body.currency, 
      cash_amount: req.body.cash_amount,
      external_account_id: req.body.external_account_id,
    }).complete(function(err, transaction) {
      res.send({ error: err, external_transaction: transaction });
    });
  };

  function index(req, res) {
    User.find(req.params.id).complete(function(err, user) {
      user.externalTransactions(function(err, transactions) {
        res.send({ external_transactions: (transactions || []) });
      });
    });
  } 

  return {
		index: index,
    create: create
	}
})();