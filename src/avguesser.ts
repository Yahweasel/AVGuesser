/*
 * Copyright (c) 2025 Yahweasel
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

export interface AVGuessFail {
    success: false;
}

export interface AVGuessSuccess {
    success: true;

    /**
     * Format name. For audio and video files, this is the name that
     * FFmpeg/libav would give to the format, which is not necessarily the
     * common file extension.
     */
    format: string;

    /**
     * Can this format contain audio?
     */
    audio: boolean;

    /**
     * Can this format contain video?
     */
    video: boolean;

    /**
     * Is this format generally used for images (other than, e.g., the album
     * cover in ID3 metadata)?
     */
    image: boolean;
}

export type AVGuess = AVGuessFail | AVGuessSuccess;

type TypedArray = {
    buffer: ArrayBuffer,
    byteOffset: number,
    byteLength: number
};

/**
 * Guess the type of this media file based on its header.
 */
export function guess(headerRaw: ArrayBuffer | TypedArray): AVGuess {
    let header: Uint32Array;
    if ((<TypedArray> headerRaw).buffer) {
        const hrta = <TypedArray> headerRaw;
        header = new Uint32Array(
            hrta.buffer, hrta.byteOffset, ~~(hrta.byteLength / 4)
        );
    } else {
        const hrab = <ArrayBuffer> headerRaw;
        header = new Uint32Array(hrab, 0, ~~(hrab.byteLength / 4));
    }

    // Return this type
    function t(format: string, audio: number, video: number, image: number) {
        return <AVGuessSuccess> {
            success: true,
            format,
            audio: !!audio,
            video: !!video,
            image: !!image
        };
    }

    // Determined based on first word
    switch (header[0]) {
        case 0x4d524f46: return t("aiff", 1, 0, 0);
        case 0x75b22630: return t("asf", 1, 1, 0);
        case 0x646e732e: return t("au", 1, 0, 0);
        case 0x46464952: {
            switch (header[2]) {
                case 0x20495641: return t("avi", 1, 1, 0);
                case 0x45564157: return t("wav", 1, 0, 0);
                case 0x50424557: return t("webp", 0, 1, 1);
            }
            break;
        }
        case 0x66666163: return t("caf", 1, 0, 0);
        case 0x43614c66: return t("flac", 1, 0, 0);
        case 0x01564c46: return t("flv", 1, 1, 0);
        case 0x38464947: return t("gif", 0, 1, 1);
        case 0xa3df451a: return t("matroska", 1, 1, 0);
        case 0x5367674f: return t("ogg", 1, 1, 0);
        case 0x474e5089: return t("png", 0, 0, 1);
        case 0x464d522e: return t("rm", 1, 1, 0);

        case 0x002a4949:
        case 0x002b4949:
        case 0x2a004d4d:
        case 0x2b004d4d:
            return t("tiff", 0, 0, 1);

        case 0x6b707677: return t("wv", 1, 0, 0);
    }

    // Determined based on first three bytes
    switch (header[0] & 0xffffff) {
        case 0x00071f: return t("dv", 1, 1, 0);
        case 0xffd8ff: return t("jpeg", 0, 0, 1);
        case 0x334449: return t("mp3", 1, 0, 0);
        case 0x010000: return t("mpeg", 1, 1, 0);
    }

    // Determined based on the second word
    switch (header[1]) {
        case 0x70797466: return t("mp4", 1, 1, 0);
    }

    // Hail mary for the one-byte determiner of MPEG TS
    if ((header[0] & 0xff) === 0x47)
        return t("mpegts", 1, 1, 0);

    return {
        success: false
    };
}
