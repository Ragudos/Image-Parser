## Modules

<dl>
<dt><a href="#module_utils/debug/assert">utils/debug/assert</a></dt>
<dd><p>contains all assertion methods used by the program.</p>
</dd>
<dt><a href="#module_utils/debug/errors">utils/debug/errors</a></dt>
<dd><p>A file of all custom errors</p>
</dd>
<dt><a href="#module_utils/numbers/const">utils/numbers/const</a></dt>
<dd><p>contains constants about number that are used by the program</p>
</dd>
<dt><a href="#module_core/png">core/png</a></dt>
<dd><p>ALl PNG related operations are in this file.</p>
</dd>
</dl>

<a name="module_utils/debug/assert"></a>

## utils/debug/assert
contains all assertion methods used by the program.

<a name="module_utils/debug/assert..assert"></a>

### utils/debug/assert~assert(condition, [message]) ⇒ <code>void</code>
**Kind**: inner method of [<code>utils/debug/assert</code>](#module_utils/debug/assert)  

| Param | Type | Description |
| --- | --- | --- |
| condition | <code>boolean</code> | What to assert. Logs an error if false |
| [message] | <code>string</code> \| <code>Error</code> | Error message |

<a name="module_utils/debug/errors"></a>

## utils/debug/errors
A file of all custom errors


* [utils/debug/errors](#module_utils/debug/errors)
    * [~UnsupportedError](#module_utils/debug/errors..UnsupportedError)
        * [new UnsupportedError([message])](#new_module_utils/debug/errors..UnsupportedError_new)
    * [~UnimplementedError](#module_utils/debug/errors..UnimplementedError)
        * [new UnimplementedError([message])](#new_module_utils/debug/errors..UnimplementedError_new)

<a name="module_utils/debug/errors..UnsupportedError"></a>

### utils/debug/errors~UnsupportedError
**Kind**: inner class of [<code>utils/debug/errors</code>](#module_utils/debug/errors)  
<a name="new_module_utils/debug/errors..UnsupportedError_new"></a>

#### new UnsupportedError([message])

| Param | Type |
| --- | --- |
| [message] | <code>string</code> | 

<a name="module_utils/debug/errors..UnimplementedError"></a>

### utils/debug/errors~UnimplementedError
**Kind**: inner class of [<code>utils/debug/errors</code>](#module_utils/debug/errors)  
<a name="new_module_utils/debug/errors..UnimplementedError_new"></a>

#### new UnimplementedError([message])

| Param | Type |
| --- | --- |
| [message] | <code>string</code> | 

<a name="module_utils/numbers/const"></a>

## utils/numbers/const
contains constants about number that are used by the program

<a name="module_core/png"></a>

## core/png
ALl PNG related operations are in this file.

<a name="module_core/png.PNG_SIGNATURE"></a>

### core/png.PNG\_SIGNATURE
A PNG file will always have this first 8 bytes.

In *decimal (base-10)*, it looks like:

```javascript
[137, 80, 78, 71, 13, 10, 26, 10]
```

**Kind**: static constant of [<code>core/png</code>](#module_core/png)  
**See**: http://www.libpng.org/pub/png/spec/1.2/PNG-Structure.html  
