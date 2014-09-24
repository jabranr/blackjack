/**
 *
 * Simple BlackJack game
 * @author: Jabran Rafique <hello@jabran.me>
 *
 */

!(function(window, factory)	{
	
	// Global object
	window.BlackJack = window.BlackJack || factory;

})(this, (function()	{

	// Empty global object
	var BlackJack = {};

	// Object methods
	BlackJack = {

		// DOM loaded method
		domLoaded: function(callback) {
			return this.on('load', window, callback);
		},

		// Card class
		Card: function(type, value) {
			this.type = type;
			this.value = value;
			this.setScore();
		},

		// Possible card options
		cards: {
			types: ['spade','heart','diamond','club'],
			values: ['ace','king','queen','jack', 2, 3, 4, 5, 6, 7, 8, 9, 10],
			symbols: {
				'spade': '&#9824;',
				'heart': '&#9829;',
				'diamond': '&#9830;',
				'club': '&#9827;'
			}
		},

		// Deal class
		Deal: function(id) {
			this.id = id;
			this.drawn = [];
			this.deck();
			return this;
		},

		// Save 52 cards as an array
		deck: [],

		// Global event listener method
		on: function(event, elm, callback) {
			if ( window.addEventListener ) {
				elm.addEventListener(event, callback, false);
			}
			else {
				if ( window.attachEvent ) {
					elm.attachEvent('on' + event, callback);
				}
			}
		}

	};

	// Return global object
	return BlackJack;

})());

// Add prototype methods for Card class
BlackJack.Card.prototype = {
	setScore: function() {
		switch (this.value) {
			case 'ace':
				this.score = 11;
				break; 
			case 'king':
			case 'queen':
			case 'jack':
				this.score = 10;
				break; 
			default:
				this.score = 1;
				break; 
		}
	}
};

// Add prototype methods for Deal class
BlackJack.Deal.prototype = {

		// Draw a random card and add to drawn array
		draw: function() {
			var randomCard = Math.round(Math.random() * Math.max(this.collection.length));
			
			for (var i = 0; i < this.drawn.length; i++) {
				if ( this.drawn[i].value != this.collection[randomCard].value && this.drawn[i].type != this.collection[randomCard].type ) {
					this.drawn.push(this.collection[randomCard]);
					break;
				}
			}

			return this.collection[randomCard];
		},

		// Initialize 52 deck of card
		deck: function() {
			this.collection = [];
			var that = BlackJack;
			for (var j = 0; j < that.cards.values.length; j++) {
				for (var i = 0; i < that.cards.types.length; i++) {
					var card = new that.Card(that.cards.types[i], that.cards.values[j]);
					this.collection.push(card);
				}
			}
			return this;
		},

		show: function(card, elm) {
			var div = document.createElement('div');
			div.id = card.value;
			div.innerHTML = card.value + ' of ' + card.type;
			document.getElementById(elm).appendChild(div);

			// update score
			this.updateScore(card, elm);

			return this;
		},

		updateScore: function(card, elm) {
			var score = document.getElementById(elm + '-score');
			score.innerHTML = parseInt(score.innerHTML) + card.score;

			if ( parseInt(score.innerHTML) > 21 ) {
				alert(elm + ' lost the game!');
			}
		}
};


// DOM method calls
(function()	{
	BlackJack.domLoaded(function() {

		var dealerCards, playerCards, dealer = true;

		dealerCards = new BlackJack.Deal('dealer');
		playerCards = new BlackJack.Deal('player');

			if (dealer) {
				dealerCards.show(dealerCards.draw(), 'dealer');
				dealer = false;
			}
			else {
				playerCards.show(playerCards.draw(), 'player');
				dealer = true;
			}

		BlackJack.on('click', document.getElementById('hit'), function(e)	{
			if (dealer) {
				dealerCards.show(dealerCards.draw(), 'dealer');
				dealer = false;
			}
			else {
				playerCards.show(playerCards.draw(), 'player');
				dealer = true;
			}
		});

		BlackJack.on('click', document.getElementById('stick'), function(e)	{
			if ( !dealer ) {
				dealerCards.show(dealerCards.draw(), 'dealer');
				dealer = false;
			}
		});

	});
})();