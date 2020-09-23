<p align="center">
  <img width="345" src="https://raw.githubusercontent.com/recogito/annotorious/master/annotorious-logo-white-small.png" />
  <br/><br/>
</p>

A JavaScript image annotation library. Add drawing, commenting and labeling functionality to images
in Web pages with just a few lines of code. This project is a modernized reboot of the outdated 
original [Annotorious](https://github.com/annotorious/annotorious). See the 
[project website](https://recogito.github.io/annotorious/) for details and live demos.



## Using

```html
<body>
  <div id="content">
    <img id="hallstatt" src="640px-Hallstatt.jpg">
  </div>
  <script>
    (function() {
      var anno = Annotorious.init({
        image: 'hallstatt'
      });

      anno.loadAnnotations('annotations.w3c.json');
    })()
  </script>
  <script type="text/javascript" src="annotorious.min.js"></script>
</body>
```
Full documentation is [on the Main project website](https://recogito.github.io/annotorious/). This is my private customised version.


## License

[BSD 3-Clause](LICENSE) (= feel free to use this code in whatever way
you wish. But keep the attribution/license file, and if this code
breaks something, don't complain to us :-)


