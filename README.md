wn() JavaScript toolbox
=======================

wn() is a lightweight, standalone and unobtrusive JavaScript toolbox
for the following common tasks:

-   [setting nested namespaces](#namespaces) (or
    modular if you like)
-   [dynamic script
    loading](#loading) (with
    namespace support)
-   [classical inheritance](#inheritance) (with
    namespace support)

Have a look at [my blog](http://float-middle.blogspot.co.uk/2012/05/namespaces-inheritance-and-dynamic.html)
to find out what I was thinking.

<h2 id="namespaces">Namespaces</h2>

Primarily namespaces help preventing pollution of the global namespace.
Extensive usage of global variables and functions can cause conflicts
with other careless pieces of code.

***Anti-example***

    // two functions with not so uncommon names created in the global namespace - awful
    function popup()
    {
    // ...
    }

    function init()
    {
    // ...
    }

The idea is to reduce number of global objects to one managing
namespaces.

***Example***

    // the global namespace remains clean
    // we need only one global object
    wn('popup', function popup()
    {
    // ...
    });

    wn('init', function init()
    {
    // ...
    });

Then you can use the functions assigned to namespaces above like so:

***Example***

    wn('popup')();
    wn('init')();

    // ... or if you prefer create a shortcut variable
    // in any non-global scope
    (function() {
            var popup = wn('popup');
            // ...
            popup();
    })();
    // note: the immediate function above is to prevent
    // pollution of the global namespace with the popup variable
    // of course any non-global scope would do, I am just making a point

### What can a namespace represent?

Short answer: anything. It can be any type of object or primitive value.
Function, array, string, boolean - you name it. It makes no matter.

***Example***

    wn('ip', '127.0.0.1');
    wn('lib.wn', wn);
    wn('utils.popup', function popup() {
    // ...
    });

    // and you can access them all in a similar, consistent way:
    wn('ip'); // returns '127.0.0.1'
    wn('lib.wn'); // returns the wn() library itself
    wn('utils.popup')(); // calls the popup() function

### Nested namespaces (modules)

Having all namespaces set on the root level would become quite messy
very quickly. Instead you can organize them in a directory-like fashion
often called nested namespaces, modules or packages.

Following up on the first example, we could decide to have our
namespaces organised somewhat better. The likes of init() and popup()
could belong to a module called 'utils'. Let's see how it's done.

***Example***

    // you don't have to initialize the 'utils' namespace, it happens automagically
    // we use period '.' to descend in the namespace tree
    wn('utils.popup', function popup()
    {
    // ...
    });

    wn('utils.init', function init()
    {
    // ...
    });
    // again, you can use it like so:
    wn('utils.popup')();

wn() supports virtually infinite nesting, so nothing stops you from
creating namespaces a few levels deep.

    wn('utils.popup.types.big', {
            widht: 800,
            height: 600
    });

### Namespace objects and values represented by namespaces

I have seen a lot of implementations which tie down a namespace with an
object that it represents. They confuse creating new property on an
object represented by a namespace with setting a child namespace. In my
opinion that approach is fundamentally wrong. It requires that
namespaces can be assigned to objects only and it does not support
inheritance in a natural way.

***Anti-example***

    // assign constructor function User() to the 'User' namespace
    SomeBadLib.namespace('User', function User() {
    // ...
    });
    // so far, so good, however...
    // assigning constructor function Admin() to the 'User.Admin' namespace...
    SomeBadLib.namespace('User.Admin', function Admin() {
    // ...
    });
    // ... turns out equivalent to assigning property Admin to the constructor function User():
    SomeBadLib.namespace('User').Admin === SomeBadLib.namespace('User.Admin'); // true

Luckily, wn() draws a line between a namespace and a value represented
by that namespace. It helps namespaces to reflect elegantly the
structure of your code. For example, if Admin inherits after User then
you can create a nice and meaningful namespace for it, say 'User.Admin'
without affecting User.

***Example***

    wn('User', function User() {
    // ...
    });

    // if Admin was a child of User it could be reflected in the namespace structure
    wn('User.Admin', function Admin() {
    // ...
    });

    // Admin should not become a property of User and it doesn't
    wn('User').Admin === wn('User.Admin'); // false

### Addressing namespace objects directly

wn() also allows you to access the namespace objects directly. Should
you like to access all child namespaces of 'User' there is an easy way
of doing so.

***Example***

    // somewhere in a non-global scope
    var user_ns = wn('User.'),
            child_ns;

    // you can iterate through child namespaces of 'User'
    // take care not to modify the namespace objects - they are not copies! 
    for (child_ns in user_ns) {
            console.log(child_ns);
    }

Similarly, you can add multiple child namespaces with one wn() call.

***Example***

    // simply wrap child namespaces in an object
    wn('User.', {
            Guest: function Guest() {
                    // ...
            },
            Customer: function Customer() {
                    // ...
            }
    });

    // then you can access child namespaces as usual
    // somewhere in a non-global scope
    var Guest = wn('User.Guest');
    var Customer = wn('User.Customer');

You can access the root namespace object in a similar fashion.

***Example***

    // somewhere in a non-global scope
    var root_ns = wn('.'),
            child_ns;

    for (child_ns in root_ns) {
            console.log(child_ns);
    }

For consistency you can also address any namespace adding period '.' in
front of it. By the way, this is how the namespaces are represented
internally by wn().

***Example***

    // assigning a namespace with a '.' at the beginning...
    wn('.User', function User() {
            // ...
    });

    // ... is equal to assigning it in the way we have already discussed
    wn('User', function User() {
            // ...
    });

    // the same applies to accessing namespaces
    wn('.User') === wn('User') // true

<h2 id="loading">Dynamic script loading</h2>

There are a few major benefits of loading scripts dynamically:

-   defining dependecies between scripts is easy and effective
-   page load time is reduced compared to when scripts are loaded
    statically
-   number of statically loaded scripts can be greatly reduced, usually
    you need only two

wn() gives you all the above and more - it supports namespaces for
dynamic script loading. The idea is simple - you tell wn() which
namespaces are required and specify callback function to be run when
your requirements are satisfied.

***Example***

    // when the namespace 'utils.popup' is loaded run the callback function
    wn.require('utils.popup', function() {
            // now you can run popup()
            wn('utils.popup')();
    });

Of course wn() needs to know where to find files which define required
namespaces. Here's where the mapping between namespaces and URLs kicks
in. The mapping can be done manually and/or automatically.

### Manual NS to URL mapping

Let's start with manual namespace to URL mapping.

***Example***

    // tell wn() where to find the file defining required namespace
    wn.loader.addMapping('utils.popup', '/assets/js/utils/popup.js');

    // now require utils.popup
    wn.require('utils.popup', function() {
            // now you can run popup()
            wn('utils.popup')();
    });

By default wn() expects that the loaded script sets the required
namespace. The callback function is run only after the namespace has
been assigned. But sometimes you need to load scripts which do not set
namespaces.

***Example***

    // tell wn() that the file will not set a namespace - note the third argument
    // when the namespace is required wn() will run callback upon the script load
    wn.loader.addMapping('files.jQuery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', true);

    // now require files.jQuery
    wn.require('files.jQuery', function() {
            // now you can use jQuery
            $('body').addClass('jquery-loaded');
    });

### Automatic NS to URL mapping

Manual mapping comes in handy but in most cases it's much more
convenient to leave the mapping task to wn(). For that to work your file
naming convention needs to reflect somehow your namespace structure. By
default wn() assumes your files exist inside the '/js/' directory, have
suffix '.js' and namespaces translate to directory names.

***Example***

    // with the default settings wn() will try to load the file '/js/User/Admin.js' 
    wn.require('User.Admin', function() {
            // now you can use 'User.Admin'
            var admin = new (wn('User.Admin'))();
    });

When you create a library of functions, it's usually handy to bundle
them up into one parent namespace and require just the parent namespace.
By default wn() assumes that the name of a file defining parent
namespace ends with '\_'.

***Example***

    // file '/js/utils_.js'
    wn('utils.', {
            popup: function popup() {
                    // ...
            },
            init: function init() {
                    // ...
            }
    );

    // some other file
    // wn() will try to load the file '/js/utils_.js'
    wn.require('utils.', function() {
            // now you can run popup()
            wn('utils.popup')();
    });

### Configuring automatic NS to URL mapping

You can easily configure the automatic mapping to your liking. Location
and file suffix are trivial to change.

***Example***

    // tell wn() where to find the files
    wn.loader.urlPrefix = 'http://some.cdn.com/assets/javascript/';
    // tell wn() what suffix the files have
    wn.loader.urlSuffix = '.ecma';

    // wn() will try to load the file 'http://some.cdn.com/assets/javascript/User/Guest.ecma' 
    wn.require('User.Guest', function() {
            // now you can use User.Guest
            // ...
    }

Changing translation of namespaces into filenames is easy as well. You
just need to overwrite the default method wn.loader.ns2url(). Let's have
a look at the default implementation first.

***Default implementation of wn.loader.ns2url()***

    /**
     * Converts a namespace into a url
     * 
     * @param {string} ns - The namespace to be converted into a url.
     * @returns {string} - The resulting url.
     * 
     * @description This method can be easily replaced in order to provide environment specific and more sophisticated conversion.
     */
    ns2url: function(ns)
    {
            // internally all namespaces start with '.' - get rid of it
            // namespace ending with '.' means parent - file should end with '_'
            // namespace path reflects directory path so all remaining '.'s are replaced with '/'s
            return this.urlPrefix + ns.replace(/^\./, '').replace(/\.$/, '_').replace(/\./, '/') + this.urlSuffix;
    }

ns2url() is executed within the context of the wn.loader object, so you
can easily access urlPrefix and urlSuffix. Of course you can choose not
to use it at all.

***Example***

    // overwrite ns2url() to customize automatic mapping
    wn.loader.ns2url = function(ns) {
            // we don't use this.urlPrefix just because we don't have to
            return '/assets/js/'
                    + ns
                            // get rid of the leading '.' from the namespace
                            .replace(/^\./, '')
                    // we add the file suffix from this.urlSuffix because we can
                    + this.urlSuffix;
    }

    // wn() will try to load the file '/assets/js/User.Customer.js'
    wn.require('User.Customer', function() {
            // now you can use User.Customer
            // ...
    });

    // wn() will try to load the file '/assets/js/utils..js' - note the extra '.' before '.js'
    wn.require('utils.', function() {
            // now you can use utils.
            // ...
    });

### Preloading namespaces

With wn() you can require the same namespace over and over again but the
corresponding file will be loaded once and once only. Therefore you can
truly define depedencies between namespaces but also preload namespaces
required later.

***Example***

    wn.loader.addMapping('files.jQuery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', true);

    // we know that jQuery will be required later,
    // so we can preload it to save some time down the line
    wn.require('files.jQuery');
    // lots going on here
    // ...

    // we get to the point where jQuery is actually required
    wn.require('files.jQuery', function() {
            // now you can use jQuery
            $('body').addClass('jquery-loaded');
    });

### Requiring multiple namespaces

Sometimes a piece of code depends on a few namespaces rather than just
one. wn() allows for defining multiple dependecies just as easily.
Simply wrap the required namespaces in an Array.

***Example***

    wn.require(['User', 'User.Admin', 'User.Customer', 'User.Guest'], function() {
            // now you can use all of the required namespaces
            // ...
    });

### Nesting namespace dependencies

The most obvious example is explicit nesting of dependecies. It happens
when a callback function passed to wn.require() calls wn.require()
again. It's a perfectly safe thing to do and wn() puts no limits on such
nesting. Let's see how it works and how to put in use a few tricks we
have discussed so far.

***Example***

    wn.loader.addMapping('files.jQuery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', true);

    // preload jQuery for later use
    wn.require('files.jQuery');

    // most of the code requires only 'utils.',
    // so there is no point in waiting for jQuery to load
    wn.require('utils.', function() {
            // now you can use utils, e.g.
            wn('utils.init')();
            // ...
            
            // and now we get to a point where jQuery is required
            // but it's been preloaded so this part should be executed faster
            wn.require('files.jQuery', function() {
                    $('a.popup').click(function(e) {
                            wn('utils.popup')(this.href);
                    });
            });
            
            // please bear in mind that any code after this point
            // must not depend on the execution of the last callback function
            // ...
    });

Another example would be implicit nesting. It happens when a script
loaded with a call to wn.require() calls wn.require() again. Similarly,
no limits and it's safe.

***Example***

    // file /js/User/Admin.js
    wn.require('User', function() {
            // ...
    });

    // some other file
    wn.require('User.Admin', function() {
            // ...
    });

Of course it goes without saying that creating circular dependecies is
never a good idea.

<h2 id="inheritance">Inheritance</h2>

Inheritance can be expressed in various ways in JavaScript. I belive
this is not the right place to try and convince anyone why one model is
better than another. wn() supports inheritance of constructor functions
which allows for type checking using operator 'instanceof'.

***Example***

    // obviously in some non-global scope

    // create the parent constructor function
    function User() {}

    // create the child constructor function
    function Admin() {}

    // make the child inherit after the parent
    // this is all that's required
    wn.inherit(Admin, User);

    // create instances
    var user = new User();
    var admin = new Admin();

    // test it out
    console.log(user instanceof User);                      // true
    console.log(user instanceof Admin);                     // false
    console.log(admin instanceof User);                     // true
    console.log(admin instanceof Admin);                    // true

Awesome. In real life you would also need to add some methods and
properties to your objects. You can do that through prototype and use
wn.inherit() as before.

***Example***

    // somewhere in a non-global scope

    // create the parent constructor function
    function User() {
            this.init.apply(this, arguments);
    }

    // add some properties to the prototype
    // wn.extend() extends an object with another object 
    // we don't want to lose any native prototype properties
    // and especially prototype.constructor
    wn.extend(User.prototype, {
            username: '',
            init: function(username)
            {
                    this.username = username;
            }
    });

    // usually it's a good idea to assign a namespace
    // to a constructor function for future use
    wn('User', User);

    // create the child constructor function
    function Admin() {
            this.init.apply(this, arguments);
    }

    // inherit
    wn.inherit(Admin, 'User');

    // wn.inherit() also accepts a namespace as the second parameter,
    // so the above is equivalent to:
    // wn.inherit(Admin, User);

    // namespaces can elegantly reflect the inheritance chain
    // Note: Admin *does not* become a property of User here,
    // please refer to the namespace examples
    wn('User.Admin', Admin);

    // Admin does not have its own properties yet
    // but should have inherited User's properties and methods,
    // such as init() 

    // create instances
    var user = new User('jack');
    // inherited User.prototype.init() sets property username
    var admin = new Admin('mark'); 

    // test it out
    console.log(user.username);                             // 'jack'
    console.log(admin.username);                            // 'mark'

When you define child's instance properties you can do so before or
after you call wn.inherit(). The order does not really matter. Now,
let's add some instance methods to Admin. The following example is a
direct continuation of the previous one.

***Example (cont.)***

    // somewhere in a non-global scope
    // continuation of the previous example

    // add child specific instance properties
    wn.extend(Admin.prototype, {
            delUser: function(user)
            {
                    // some mean implementation or removing a user
                    // ...
                    
                    return true;
            },
            
            addUser: function(user)
            {
                    // some friendly implementation of adding a user
                    // ...
                    
                    return true;
            }
    });

    // test it out
    console.log(admin.delUser(user));                       // true
    console.log(admin.addUser(user));                       // true
    console.log(user.delUser(user));                        // error thrown - delUser() is not a function

Sometimes a child needs to override parent's methods. When that happens,
being able to call parent's version of the overriden method comes in
handy.

wn.inherit() extends child's prototype with property 'parent' pointing
to parent's prototype. The following example is direct continuation of
the previous one.

***Example (cont.)***

    // somewhere in a non-global scope
    // continuation of the previous example

    // override init()
    wn.extend(Admin.prototype, {
            init: function init()
            {
                    // call parent's version of init()
                    this.parent.init.apply(this, arguments);
                    
                    // some Admin specific actions
                    // ...
            }
    });
