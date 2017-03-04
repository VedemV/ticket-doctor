'use strict';

/**
 * Module dependencies.
 */
const webdriver = require('selenium-webdriver');
const until = webdriver.until;
const fs = require('fs');

/**
 * Configuration
 * @type Object
 */
let config = JSON.parse(String(fs.readFileSync('config.json')));

let builder = new webdriver.Builder();
builder.forBrowser('chrome');
let driver = builder.build();

let iterate = 0;

let clinic = config.links[config.clinic];
let url = clinic.url;
let xpath = clinic.xpath[config.po];
let docName = config.docName === 'любой' ? 'любому' : 'врачу '+(config.docName || '');
let date = config.date || '';

function getTicket(done){
	
	driver
		.then( _ => driver, _ => { console.log('Browser not found'); done(true); } )
		.then(driver.get(url))
		.then( _ => driver.wait(until.elementLocated({ xpath: xpath }), 1000).click() )
		.then( _ => driver.wait(until.titleIs('Выбор специальности врача'), 1000) )
		.then( _ => driver.findElement({css: 'button.SM_ACTIV[title^="Записаться в очередь к врачу ' + config.doctor + '"]'}).click() )
		.then( _ => driver.findElement({css: 'button.SM_ACTIV[title^="Записаться в очередь к ' + docName + '"]'}).click() )
		.then( _ => driver.findElement({css: 'button.SM_ACTIV[title^="Выбрать дату ' + date + '"]'}).click() )
		.then( _ => driver.findElement({css: 'button.SM_ACTIV[title*="Записаться"]'}).click() )
		.then( _ => driver.findElement({css: 'input#SURNAME'}).sendKeys(config.SURNAME) )
		.then( _ => driver.findElement({css: 'input#NAME1'}).sendKeys(config.NAME1) )
		.then( _ => driver.findElement({css: 'input#NAME2'}).sendKeys(config.NAME2) )
		.then( _ => driver.findElement({css: 'input#DR'}).sendKeys(config.DR) )
		.then( _ => driver.findElement({css: 'input#TEL'}).sendKeys(config.TEL) )
		.then( _ => driver.findElement({css: 'select[name="POINTCART"]'}).click() )
		.then( _ => driver.findElement({css: 'select[name="POINTCART"] > option:nth-child(2)'}).click() )
		.then( _ => driver.findElement({css: 'input#csd'}).click() )
		.then( _ => driver.findElement({css: 'button.SM_ACTIVFREE[type="submit"]'}).click() )
		.then( _ => done(true), e => {
			console.log(e.toString());
			done(false);
		} )
	;
}

function tick(){
	process.nextTick( function(){
		getTicket(function(success){
			if( !success ){
				tick();
			} else {
				console.log(iterate, new Date());
			}
		});
		
	});
}

console.log(config);
tick();

