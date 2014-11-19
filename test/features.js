var assert = require("assert");
var gatewayd = require(__dirname+'/../');

describe('Beta feature flags', function() {

  before(function() {
    gatewayd.features.enable('shinyNewEndpoint');
  });

  it('should read whether a feature is enabled', function() {
    assert(gatewayd.features.isEnabled('shinyNewEndpoint')); 
  }); 

  it('should disable a feature', function() {
    gatewayd.features.disable('shinyNewEndpoint'); 

    assert(!gatewayd.features.isEnabled('shinyNewEndpoint')); 
  });

});

describe('Loading features from a file', function() {

  before(function() {
    // By default gatewayd loads from config/features.json
    gatewayd.features.persist(__dirname+'/fixtures/features.json');
    /* test/fixtures/features.json
      {
        "enabledFeatureFromJson": true,
        "disabledFeatureFromJson": false
      }
    */
  });

  it('should load features from a json file', function() {
    assert(gatewayd.features.isEnabled('enabledFeatureFromJson'));
    assert(!gatewayd.features.isEnabled('disabledFeatureFromJson'));
  });

});

console.log(gatewayd.features.allFeatures());

