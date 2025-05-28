# AVGuesser

This is an extremely simple utility for guessing the filetype of audio/video
files. It can identify all common audio/video formats (including image formts)
and is extremely tiny.

The goal of AVGuesser is simply to be a tiny “step zero”. Paired with
[libav.js](https://github.com/Yahweasel/libav.js)'s modular builds, you can use
this tool to choose which demuxer to load, then load the appropriate demuxer
without loading every other demuxer. Because it pairs with libav.js, all¹ names
are in libav.js format.

¹ With the exception of image files, which are supported in weird ways in
  libav.js anyway.

## Using AVGuesser

Slice the first 12 bytes off of the file and pass it to `AVGuesser.guess` as an
ArrayBuffer:

```javascript
import * as AVGuesser from "avguesser";

const file = ... // some File or Blob object
const result = AVGuesser.guess(await file.slice(0, 12).arrayBuffer());
console.log(result);
```

Results are of one of two forms. If the file could not be identify, the result
is simply

```typescript
{
    success: false
}
```

If the file could be identified, the result is

```typescript
{
    success: true,
    audio: boolean,
    video: boolean,
    image: boolean
}
```

The `audio`, `video`, and `image` fields correspond to whether this file type
*can* contain the given type of data, and not whether the file in question
*does* contain it. You will need to use an actual demuxer to find what's in the
file.

Non-ES6-module builds of AVGuesser expose a global object `AVGuesser`.
