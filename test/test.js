var divisive = require('../divisive.js');
var should = require("chai").should();
var uuid = require("uuid");
var fs = require("fs");
var GeneratedDocument = require('fake-csv');
var testTool = require('app-term-kit/src/test-util.js');

var seedList = [
    'eee8a0ac-73ff-460f-8776-63c1bb764e59',
    '5c22fc68-beee-48e6-b4c4-618135e0565d',
    'b8f50027-cc8b-47f9-aabf-95529421f874',
    '442f686b-7bf4-42cf-80d3-f69f3c6fa8e2'
];

var runTests = function(){
    describe('divisive', function(){
        runTestsForType('CSV');
        runTestsForType('TSV');
        runTestsForType('SSV');
        runTestsForType('DSV');
    });
}

var runTestsForType = function(type){
    describe(type, function(){
        makeRandomFunctionTest(type);
        seedList.forEach(function(seed){
            makeRandomFunctionTest(type, seed);
        });
    });
}

var makeRandomFunctionTest = function(type, seed){
    var size = {rows : 100, cols : 10};
    var random = uuid.v4();
    var test = seed?
        'parses deterministic '+type+':'+seed:
        'parses a random '+type+':'+random;
    it(test, function(complete){
        var virtualCSV = new GeneratedDocument({
            counts : size,
            type : type,
            seed : (seed || random)
        });
        var stream = virtualCSV.readableStream();
        testTool.executeActionUsingFileFromBody(
            './bin/dsv',
            'parse',
            stream,
            type,
            (err, result)=>{
                result.length.should.equal(size.rows);
                //allow for column intersection
                Object.keys(result[0]).length.should.be.above(size.cols/2);
                complete();
            }
        );
    });
}

runTests();
