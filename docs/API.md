## Modules

<dl>
<dt><a href="#module_utils/debug/assert">utils/debug/assert</a></dt>
<dd><p>contains all assertion methods used by the program.</p>
</dd>
<dt><a href="#module_utils/debug/errors">utils/debug/errors</a></dt>
<dd><p>A file of all custom errors</p>
</dd>
<dt><a href="#module_utils/is">utils/is</a></dt>
<dd><p>A list of utilities that determine what an unknown variable is.</p>
</dd>
<dt><a href="#module_utils/numbers/compute/engine">utils/numbers/compute/engine</a></dt>
<dd><p>All main operations for computations</p>
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

<a name="module_utils/is"></a>

## utils/is
A list of utilities that determine what an unknown variable is.


* [utils/is](#module_utils/is)
    * [.isPlainObject(obj)](#module_utils/is.isPlainObject) ⇒ <code>boolean</code>
    * [.isFunction(obj)](#module_utils/is.isFunction) ⇒ <code>boolean</code>
    * [.isString(obj)](#module_utils/is.isString) ⇒ <code>boolean</code>
    * [.isArray(obj)](#module_utils/is.isArray) ⇒ <code>boolean</code>
    * [.isNumber(obj)](#module_utils/is.isNumber) ⇒ <code>boolean</code>

<a name="module_utils/is.isPlainObject"></a>

### utils/is.isPlainObject(obj) ⇒ <code>boolean</code>
**Kind**: static method of [<code>utils/is</code>](#module_utils/is)  

| Param | Type |
| --- | --- |
| obj | <code>unknown</code> | 

<a name="module_utils/is.isFunction"></a>

### utils/is.isFunction(obj) ⇒ <code>boolean</code>
**Kind**: static method of [<code>utils/is</code>](#module_utils/is)  

| Param | Type |
| --- | --- |
| obj | <code>unknown</code> | 

<a name="module_utils/is.isString"></a>

### utils/is.isString(obj) ⇒ <code>boolean</code>
**Kind**: static method of [<code>utils/is</code>](#module_utils/is)  

| Param | Type |
| --- | --- |
| obj | <code>unknown</code> | 

<a name="module_utils/is.isArray"></a>

### utils/is.isArray(obj) ⇒ <code>boolean</code>
**Kind**: static method of [<code>utils/is</code>](#module_utils/is)  

| Param | Type |
| --- | --- |
| obj | <code>unknown</code> | 

<a name="module_utils/is.isNumber"></a>

### utils/is.isNumber(obj) ⇒ <code>boolean</code>
**Kind**: static method of [<code>utils/is</code>](#module_utils/is)  

| Param | Type |
| --- | --- |
| obj | <code>unknown</code> | 

<a name="module_utils/numbers/compute/engine"></a>

## utils/numbers/compute/engine
All main operations for computations


* [utils/numbers/compute/engine](#module_utils/numbers/compute/engine)
    * [~isSignedByte(num)](#module_utils/numbers/compute/engine..isSignedByte) ⇒ <code>boolean</code>
    * [~isSignedShort(num)](#module_utils/numbers/compute/engine..isSignedShort) ⇒ <code>boolean</code>
    * [~isSignedInt(num)](#module_utils/numbers/compute/engine..isSignedInt) ⇒ <code>boolean</code>
    * [~isUnsignedByte(num)](#module_utils/numbers/compute/engine..isUnsignedByte) ⇒ <code>boolean</code>
    * [~isUnsignedShort(num)](#module_utils/numbers/compute/engine..isUnsignedShort) ⇒ <code>boolean</code>
    * [~getNumberType(num)](#module_utils/numbers/compute/engine..getNumberType) ⇒ <code>NumberType</code>
    * [~JsNumber](#module_utils/numbers/compute/engine..JsNumber) : <code>number</code> \| <code>bigint</code>
    * [~NumberType](#module_utils/numbers/compute/engine..NumberType) : <code>&quot;int8&quot;</code> \| <code>&quot;int16&quot;</code> \| <code>&quot;int32&quot;</code> \| <code>&quot;int64&quot;</code> \| <code>&quot;uint8&quot;</code> \| <code>&quot;uint16&quot;</code> \| <code>&quot;uint32&quot;</code> \| <code>&quot;uint64&quot;</code>

<a name="module_utils/numbers/compute/engine..isSignedByte"></a>

### utils/numbers/compute/engine~isSignedByte(num) ⇒ <code>boolean</code>
# isSignedByte(num)Checks whether `num` is an 8-bit signed integer## How it worksShift `num` to the left by 24; then, redo it to the right (signed right shift).Then, checks if the resulting value is still equal to `num`.### Why?First, we need to know the binary/bit representation of numbers inmemory. For example, `-128` and `-129````javascript-128 // 0b11111111111111111111111110000000 or 32-bit signed, -0x80-129 // 0b11111111111111111111111101111111 or 32-bit signed, -0x80000000```Notice the difference?In signed integers, it's considered as an 8-bit integer,if all bits from the least significant bit (LSB) up until the 7th bit (6th index)are the only that are either `0` or `1`, while the remaining bits until the most significantbit (MSB) is `1`.So, if we do `num << 24`, we will get:```javascript-128 // will be 0b10000000000000000000000000000000 or 32-bit signed, -2147483648-129 // will be 0b01111111000000000000000000000000 or 32-bit signed, 2130706432```Notice the difference?The most significant bit's (MSB) information about `num`, whichis that it is `-129` or a signed integer, is lost.Now, after shifting `num` to the left, do `>> 24`, we will get:```javascript-128 // will be 0b11111111111111111111111110000000 or 32-bit signed, -128, -0x80-129 // will be 0b00000000000000000000000001111111 or 32-bit signed, 127, 0x7f```The information that `num` is a signed integer is lost!

**Kind**: inner method of [<code>utils/numbers/compute/engine</code>](#module_utils/numbers/compute/engine)  
**See**: [https://www.w3schools.com/js/js_bitwise.asp](https://www.w3schools.com/js/js_bitwise.asp) know how bit shifts work  

| Param | Type |
| --- | --- |
| num | <code>number</code> | 

<a name="module_utils/numbers/compute/engine..isSignedShort"></a>

### utils/numbers/compute/engine~isSignedShort(num) ⇒ <code>boolean</code>
# isSignedShort(num)Checks whether `num` is a 16-bit signed integer## How it worksShift `num` to the left by `16`; then, redo it to the right (signed bit shift).Then, checks if the result is the same as `num`.### Why?Check [isSignedByte](isSignedByte) to know more about why this is performed.Instead of `24` from [isSignedByte](isSignedByte), `16` is used in this function.Since the start of a 16-bit signed integer's binary/bit representation is:```javascript-32_768 // 0b11111111111111111000000000000000 or 32-bit signed, -0x8000-32_769 // 0b11111111111111110111111111111111 or 32-bit signed, -0x8001```Now, do `num << 16`, we'll get:```javascript-32_768 // 0b10000000000000000000000000000000 or 32-bit signed, -2147483648, -0x80000000-32_769 // 0b01111111111111110000000000000000 or 32-bit signed, 2147418112, 0x7fff0000```Now, do `num >> 16`, we'll get:```javascript-32_768 // 0b11111111111111111000000000000000 or 32-bit signed, -0x8000-32_769 // 0b00000000000000000111111111111111 or 32-bit signed, 32767, 0x7fff```The bit that indicates it's a signed integer is gone! That's why the information aboutthe original value is lost.

**Kind**: inner method of [<code>utils/numbers/compute/engine</code>](#module_utils/numbers/compute/engine)  
**See**: [https://www.w3schools.com/js/js_bitwise.asp](https://www.w3schools.com/js/js_bitwise.asp)  

| Param | Type |
| --- | --- |
| num | <code>number</code> | 

<a name="module_utils/numbers/compute/engine..isSignedInt"></a>

### utils/numbers/compute/engine~isSignedInt(num) ⇒ <code>boolean</code>
#isSignedInt(num)Checks whether `num` is a 32-bit signed integer## How it worksUnlike [isSignedByte](isSignedByte) and [isSignedShort](isSignedShort), we just compare`num` with [MIN_INT_32BIT](MIN_INT_32BIT) and [MAX_INT_32BIT](MAX_INT_32BIT).### Why?JavaScript integers are 32-bits in memory.

**Kind**: inner method of [<code>utils/numbers/compute/engine</code>](#module_utils/numbers/compute/engine)  

| Param | Type |
| --- | --- |
| num | <code>number</code> | 

<a name="module_utils/numbers/compute/engine..isUnsignedByte"></a>

### utils/numbers/compute/engine~isUnsignedByte(num) ⇒ <code>boolean</code>
# isUnsignedByte(num)Checks whether `num` is an 8-bit unsigned integer.## How it worksApplies the AND (&) bitwise operator to `num` and `0xffff00`; then,compares the result to `0`.The AND (&) bitwise operator is somewhat the sameas the AND (&&) logical operator; wherein, it will return true if bothoperands are true and have it be 1, while 0 otherwise.The right-hand side can be considered as a `mask`.### Why?First, we must know the value of `0xffff00` in binary/bits.```javascript0xffff00 // 0b00000000111111111111111100000000255 // 0b00000000000000000000000011111111256 // 0b00000000000000000000000100000000```See the differences? Now, let's perform the AND (&) bitwise operation`255 & 0xffff00`| Operation             | Value    | Binary                             || --------------------- | -----    | ---------------------------------- || Original Value        | 255      | 0b00000000000000000000000011111111 || Mask                  | 0xffff00 | 0b00000000111111111111111100000000 || Original Value & Mask | 0        | 0b00000000000000000000000000000000 |

**Kind**: inner method of [<code>utils/numbers/compute/engine</code>](#module_utils/numbers/compute/engine)  
**See**: [https://www.w3schools.com/js/js_bitwise.asp](https://www.w3schools.com/js/js_bitwise.asp)  

| Param | Type |
| --- | --- |
| num | <code>number</code> | 

<a name="module_utils/numbers/compute/engine..isUnsignedShort"></a>

### utils/numbers/compute/engine~isUnsignedShort(num) ⇒ <code>boolean</code>
# isUnsignedShortChecks whether `num` is a 16-bit unsigned integer## How it worksThe same as [isUnsignedByte](isUnsignedByte), but instead uses `0xff0000` as the `mask`.

**Kind**: inner method of [<code>utils/numbers/compute/engine</code>](#module_utils/numbers/compute/engine)  

| Param | Type |
| --- | --- |
| num | <code>number</code> | 

<a name="module_utils/numbers/compute/engine..getNumberType"></a>

### utils/numbers/compute/engine~getNumberType(num) ⇒ <code>NumberType</code>
Despite knowing that, in memory, all numbers in JavaScript are double precision floating-points,and all integers are 32-bit, this still is useful to check the range `num` is in.

**Kind**: inner method of [<code>utils/numbers/compute/engine</code>](#module_utils/numbers/compute/engine)  
**Returns**: <code>NumberType</code> - returns the type of integer `num` is.  
**Throws**:

- <code>Error</code> Gets an unsupported number type


| Param | Type |
| --- | --- |
| num | <code>JsNumber</code> | 

<a name="module_utils/numbers/compute/engine..JsNumber"></a>

### utils/numbers/compute/engine~JsNumber : <code>number</code> \| <code>bigint</code>
**Kind**: inner typedef of [<code>utils/numbers/compute/engine</code>](#module_utils/numbers/compute/engine)  
<a name="module_utils/numbers/compute/engine..NumberType"></a>

### utils/numbers/compute/engine~NumberType : <code>&quot;int8&quot;</code> \| <code>&quot;int16&quot;</code> \| <code>&quot;int32&quot;</code> \| <code>&quot;int64&quot;</code> \| <code>&quot;uint8&quot;</code> \| <code>&quot;uint16&quot;</code> \| <code>&quot;uint32&quot;</code> \| <code>&quot;uint64&quot;</code>
**Kind**: inner typedef of [<code>utils/numbers/compute/engine</code>](#module_utils/numbers/compute/engine)  
<a name="module_utils/numbers/const"></a>

## utils/numbers/const
contains constants about number that are used by the program

<a name="module_core/png"></a>

## core/png
ALl PNG related operations are in this file.

<a name="module_core/png.PNG_SIGNATURE"></a>

### core/png.PNG\_SIGNATURE
A PNG file will always have this first 8 bytes.In *decimal (base-10)*, it looks like:```javascript[137, 80, 78, 71, 13, 10, 26, 10]```

**Kind**: static constant of [<code>core/png</code>](#module_core/png)  
**See**: http://www.libpng.org/pub/png/spec/1.2/PNG-Structure.html  
