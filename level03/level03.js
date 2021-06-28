let life = 3
const like_update = document.querySelector('#life')
const count_time = 3
const play_width = 500, play_height = 800;
const groundX = 150 + 25 , groundY = 50


const { Engine, Render, World, Bodies, Events, Mouse } = Matter
const width = 800 , height = 800
const speed = 10
const perfectProperty = {
    friction: 0,
    frictionAir: 0,
    restitution: 1,
    frictionStatic: 0
}

const staticPerfectProperty = {
    isStatic: true, ...perfectProperty
}
const canvas_div = document.querySelector('#matterjs')

let engine = Engine.create({
    positionIterations: 10,
    velocityIterations: 10
})
engine.world.gravity.y = 0


let render = Render.create({
    element: canvas_div,
    engine,
    options: {
        wireframes: false,
        width,
        height,
        background: 'rgba(99,103,227,0)',
        wireframeBackground: 'rgba(116,116,191,0)'
    }
})

let mouse = Mouse.create(render.canvas)

function timer(){
    let time_value = count_time
    let timer = document.createElement('div')
    timer.setAttribute('id', 'timer')
    document.querySelector('#matterjs').appendChild(timer)
    timer.innerHTML = `${time_value}`
    let canva = document.querySelector('canvas')
    canva.style.opacity = `0.5`
    let countTime = setInterval(function (){
        time_value --
        timer.innerHTML = `${time_value}`
        if(time_value === 0){
            clearInterval(countTime)
            let child = document.querySelector('#timer')
            document.querySelector('#matterjs').removeChild(child)
            canva.style.opacity = `1`
        }
    },1000)
}

///
/// create scene
///

function randomColorString() {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
}

let walls = [
    Bodies.rectangle(play_width / 2 + 150, 0, play_width, 50, staticPerfectProperty),
    Bodies.rectangle(play_width / 2 + 150, play_height, play_width, 50, staticPerfectProperty),
    Bodies.rectangle(150, play_height / 2, 25, play_height, staticPerfectProperty),
    Bodies.rectangle(play_width+150, play_height / 2, 25, play_height, staticPerfectProperty)
]
walls.forEach(function (wall){
    wall.render.fillStyle = 'rgb(40,62,81)'
    wall.render.strokeStyle = 'rgb(40,62,81)'
})



let ball = Bodies.circle(width / 2, height - 400, 20, perfectProperty, 1000)
ball.label = 'ball'
ball.render.fillStyle = 'rgb(255,204,0)'
ball.render.strokeStyle = 'rgb(255,204,0)'

const ball_initialVelocity = { x: 1, y: 10 }
const ball_initialPosition =  { x: width / 2, y: play_height - 400 }

Matter.Body.setVelocity(ball, ball_initialVelocity)

Events.on(engine, 'beforeUpdate', ev => {
    Matter.Body.setVelocity(ball, Matter.Vector.mult(ball.velocity, speed / ball.speed + 0.05))
    if(ball.position.y > 750 && life > 0){
        Matter.Body.setPosition(ball, ball_initialPosition)
        Matter.Sleeping.set(ball, true)
        if(life !== 1){
            timer()
        }
        setTimeout(function(){
            Matter.Sleeping.set(ball, false)
            Matter.Body.setPosition(ball, ball_initialPosition)
            Matter.Body.setVelocity(ball, ball_initialVelocity)

        }, count_time*1000)
        life --
        like_update.innerHTML = life
    }
    if(life === 0){
        let pop_up = document.createElement("div")
        pop_up.setAttribute('id', 'pop_up')
        document.querySelector('#left').appendChild(pop_up)
        let btn = document.createElement("button")
        let lose = document.createElement("h1")
        lose.setAttribute('id','lost')
        btn.innerHTML = "Replay"
        lose.innerHTML = "Game Over"
        pop_up.appendChild(lose)
        pop_up.appendChild(btn)
        World.clear(engine.world);
        Engine.clear(engine);
        engine.events = {}
        btn.addEventListener('click', function (){
            window.location.reload()
        })
    }
})

let bricks = []
let count = 1
for (let x = groundX + 35; x <= play_width + 100 ; x += 75) {
    for (let y = groundY + 10; y < height/2; y += 40) {
        if(count === 1 || count === 2 || count === 6 || count === 7  || count === 15 || count === 16|| count === 20|| count === 21|| count === 24|| count === 25|| count === 26|| count === 27|| count === 29|| count === 30|| count === 33|| count === 34|| count === 35||count === 36|| count === 42|| count ===43|| count === 46|| count === 51|| count === 52 ){

        }
        else {
            let brick = Bodies.rectangle(x, y, 60, 30, staticPerfectProperty)
            brick.label = 'brick'
            let random = randomColorString()
            brick.render.strokeStyle = random
            brick.render.fillStyle = random
            brick.render.lineWidth = 0
            bricks.push(brick)
        }
        count++
    }
}
// console.log(count)

// distroy brick
Events.on(engine, 'collisionEnd', function (event) {
    let pairs = event.pairs;
    // change object colours to show those ending a collision
    for (let pair of pairs) {
        let another
        if (pair.bodyA.label === 'ball')
            another = pair.bodyB
        else if (pair.bodyB.label === 'ball')
            another = pair.bodyA
        if (another.label === 'brick') {
            World.remove(engine.world, another)
        }
    }

    if(engine.world.bodies.length === 6){
        let pop_up = document.createElement("div")
        pop_up.setAttribute('id', 'pop_up')
        document.querySelector('#left').appendChild(pop_up)
        let btn = document.createElement("button")
        let level_complete = document.createElement('h1')
        level_complete.setAttribute('id','level_complete')
        btn.innerHTML = "Home"
        let home = document.querySelector('#homee')
        document.body.removeChild(home)
        level_complete.innerHTML = "Game Completed 🎉"
        pop_up.appendChild(level_complete)
        pop_up.appendChild(btn)
        World.clear(engine.world);
        Engine.clear(engine);
        engine.events = {}
        btn.addEventListener('click', function (){
            window.open('../home.html', '_self')
        })
    }
});

let bar_initialposition = {x:width / 2, y:height - 150 }
let bar = Bodies.rectangle(width / 2, height - 150, 150, 20, staticPerfectProperty)
bar.render.fillStyle = 'rgb(0,178,211)'
bar.render.strokeStyle = 'rgb(0,178,211)'


Events.on(engine, 'beforeUpdate', ev => {
    if(ball.position.y > 750 && life > 0 || ball.position.y === ball_initialPosition.y)
    {
        Matter.Body.setPosition(bar, bar_initialposition)
        Matter.Sleeping.set(bar, true)
    }
    else{
        Matter.Sleeping.set(bar, false)
        let xx = mapy(mouse.position.x, 0, 800, groundX + 65, 65+500)
        Matter.Body.setPosition(bar, {x: xx, y: bar.position.y})
    }
})


function mapy(variable1, min1, max1, min2, max2){
    variable1 = min2+(max2-min2)*((variable1-min1)/(max1-min1))
    return variable1
}

// World.add(engine.world, [...bricks, ...walls, bar])
timer()
setTimeout(function (){
    World.add(engine.world, [ball, bar,...bricks, ...walls])
},3000)
Engine.run(engine)
Render.run(render)