export const context: AudioContext = new AudioContext;

const sounds = {}

export async function getSound(name: string, path: string) {
    if (!sounds[name]) {
        const flapget = await fetch(path);
        context.decodeAudioData(await flapget.arrayBuffer(), function (buffer) {
            sounds[name] = buffer;
        });
    }
}

export function playSound(buffer) {
    var source = context.createBufferSource();
    source.buffer = sounds[buffer];
    source.connect(context.destination);
    source.start(0);
}