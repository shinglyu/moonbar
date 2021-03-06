document.body.classList.remove('hidden');
$.material.ripples();

// Check https://github.com/gasolin/moonbar for more detail
// lets hack apps/search/js/providers/suggestions
var verbSearch = {
  providers: [{
    name: 'Google',
    url: 'https://www.google.com/search?q='
  }, {
    name: 'Yahoo',
    url: 'https://search.yahoo.com/search?p='
  }, {
    name: 'Bing',
    url: 'https://www.bing.com/search?q='
  }, {
    name: 'Wikipedia',
    url: 'https://en.wikipedia.org/w/index.php?search='
  }],
  default: 0
};

var verbOpen = {
  providers: [{
    name: 'Facebook',
    url: 'http://www.facebook.com/'
  }, {
    name: 'Twitter',
    url: 'http://www.twitter.com/'
  }, {
    name: 'Calendar',
    url: 'http://calendar.google.com/'
  }, {
    name: 'Email',
    url: 'http://www.gmail.com/'
  }, {
    name: 'Gallery',
    url: 'http://www.flickr.com/'
  }, {
    name: 'Music',
    url: 'http://douban.fm/'
  }]
};

// init start

// the universal verb tags pool
var searchPool = [];
// the referece map to origin provider object
var reverseMap = {};

var defaultSearchProvider = 'google';

var actionMap = {
  'open': verbOpen.providers,
  'search': verbSearch.providers
}

// TODO: could do in worker
verbSearch.providers.forEach(function(ele, idx) {
  searchPool.push(ele.name.toLowerCase());
  reverseMap[ele.name.toLowerCase()] = {
    'name': ele.name,
    'type': 'search',
    'idx': idx
  };
});

verbOpen.providers.forEach(function(ele, idx) {
  searchPool.push(ele.name.toLowerCase());
  reverseMap[ele.name.toLowerCase()] = {
    'name': ele.name,
    'type': 'open',
    'idx': idx
  };
});

// init end

var huxian = {
  parse: function p_parse(input, pedia) {
    var keys = input.trimRight().split(' ');
    var verb = keys[0].toLowerCase();
    var restTerm = input.trimRight().slice(verb.length);
    var results = pedia.filter(function(element) {
      return element.indexOf(verb) > -1;
    });
    return [verb, restTerm, results];
  }
};

var renderLabels = function(element, verbs, results) {
  // render default labels
  if (!verbs || verbs.length == 0) {
    var span = document.createElement('span');
    span.classList.add('label');
    span.classList.add('label-primary');
    span.classList.add('focusable');
    span.dataset.key = 'open';
    span.textContent = 'Open';
    span.addEventListener('click', tagHandler);
    element.appendChild(span);

    verbSearch.providers.forEach(function(ele) {
      //element.innerHTML += '<span class="label label-primary">' + ele.name + '</span> ';
      var span = document.createElement('span');
      span.classList.add('label');
      span.classList.add('label-primary');
      span.classList.add('focusable');
      span.dataset.key = ele.name.toLowerCase();
      span.textContent = ele.name;
      span.addEventListener('click', tagHandler);
      element.appendChild(span);
    });
  } else {
    if (results.length != 0) {
      hasOpenTag = false;
      results.forEach(function(result) {
        var noun = reverseMap[result];
        if (noun.type == 'open' && !hasOpenTag) {
          //element.innerHTML += '<span class="label label-primary">Open</span> ';
          var span = document.createElement('span');
          span.classList.add('label');
          span.classList.add('label-primary');
          span.classList.add('focusable');
          span.dataset.key = 'open';
          span.textContent = 'Open';
          span.addEventListener('click', tagHandler);
          element.appendChild(span);
          hasOpenTag = true;
        } else {
          //element.innerHTML += '<span class="label label-primary">' + noun.name + '</span> ';
          var span = document.createElement('span');
          span.classList.add('label');
          span.classList.add('label-primary');
          span.classList.add('focusable');
          span.dataset.key = noun.name.toLowerCase();;
          span.textContent = noun.name;
          span.addEventListener('click', tagHandler);
          element.appendChild(span);
        }
      });
    } else {
      //XXX mock for suggestion tags
      element.innerHTML += '<span id="a" class="label focusable">Instant</span> ';
      element.innerHTML += '<span id="b" class="label focusable">Search</span> ';
      element.innerHTML += '<span id="c" class="label focusable">Suggestions</span> ';
    }
  }
}

var tagHandler = function(evt) {
  if (tip.classList.contains('hidden')) {
    tip.classList.remove('hidden');
  }
  tip.textContent = "tap the label should help you further scoping the suggestions around " + evt.target.textContent;
};

var clickHandler = function(evt) {
  if (tip.classList.contains('hidden')) {
    tip.classList.remove('hidden');
  }
  var type = evt.target.dataset.type;
  tip.textContent = "tap the row should " + type + ' ' + evt.target.id;
  switch (type) {
    case 'open':
      var url = actionMap[type][
        reverseMap[evt.target.id].idx
      ].url;
      //console.log('open '+ url);
      window.open(url, '_blank');
      break;
    default:
      var url = actionMap['search'][
        reverseMap[evt.target.id].idx
      ].url;
      //console.log('open ' + url + evt.target.dataset.key);
      window.open(url + evt.target.dataset.key, '_blank');
      break;
  }
};

var resetUI = function() {
  suggestionsSelect.innerHTML = '';
  suggestionTags.innerHTML = '';
  if (!tip.classList.contains('hidden')) {
    tip.classList.add('hidden');
  }
};


