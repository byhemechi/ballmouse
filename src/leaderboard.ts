import { GameLeaderboardPromiseClient } from './protos/leaderboard_grpc_web_pb'
import { Game, LeaderboardRequest, Score } from './protos/leaderboard_pb'
const client = new GameLeaderboardPromiseClient('https://ballmouse.byhe.me')

export default client

export const getPlayerName = () => {
    const name = localStorage.getItem('player-name')

    if (name !== null) return name
    let newName = ''
    while (!newName.match(/^.{4,}$/)) {
        newName = prompt('What should your name be on the leaderboard')
    }

    localStorage.setItem('player-name', newName)
    return newName
}

const untilCalled = <T>() => {
    let callback: (done: T) => void

    const next = new Promise<T>(resolve => {
        callback = resolve
    })
    return { callback, next }
}
const done = Symbol('done')

export const getLeaderboard = function getLeaderboard(game: Game) {
    const req = new LeaderboardRequest()
    req.setGame(game)

    return {
        [Symbol.asyncIterator]() {
            const stream = client.getLeaderboard(req)

            const scores: Score[] = []

            const getNext = () => untilCalled<Score | typeof done>()
            let cb = getNext()

            const handleData = (score: Score) => {
                scores.push(score)
                cb.callback(score)
                cb = getNext()
            }

            stream.on('data', handleData)

            stream.on('error', e => {
                throw e
            })

            stream.on('end', () => {
                cb.callback(done)
            })

            return {
                async next() {
                    const value = await cb.next

                    return {
                        done: value == done && scores.length == 0,
                        value: scores.shift(),
                    }
                },
            }
        },
    }
}
