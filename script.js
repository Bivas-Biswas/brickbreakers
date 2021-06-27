let life = 3
const like_update = document.querySelector('#life')
const count_time = 2
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

let engine = Engine.create({
	positionIterations: 10,
	velocityIterations: 10
})
engine.world.gravity.y = 0

let render = Render.create({
	element: document.body,
	engine,
	options: {
		wireframes: false,
		width,
		height,
	}
})

let mouse = Mouse.create(render.canvas)

function timer(){
    let time_value = count_time
    let timer = document.createElement('div')
    timer.setAttribute('id', 'timer')
    document.body.appendChild(timer)
    timer.innerHTML = `${time_value}`
    let canva = document.querySelector('canvas')
    canva.style.opacity = `0.5`
    let countTime = setInterval(function (){
        time_value --
        timer.innerHTML = `${time_value}`
        if(time_value === 0){
            clearInterval(countTime)
            let child = document.querySelector('#timer')
            document.body.removeChild(child)
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

let ball = Bodies.circle(width / 2, height - 400, 20, perfectProperty, 1000)
ball.label = 'ball'

const ball_initialVelocity = { x: 1, y: 10 }
const ball_initialPosition =  { x: width / 2, y: play_height - 400 }

Matter.Body.setVelocity(ball, ball_initialVelocity)

Events.on(engine, 'beforeUpdate', ev => {
	Matter.Body.setVelocity(ball, Matter.Vector.mult(ball.velocity, speed / ball.speed))
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
        // console.log(life)
        like_update.innerHTML = life
	}
    if(life === 0){
        let btn = document.createElement("button")
        btn.innerHTML = "Replay"
        document.body.appendChild(btn)
        World.clear(engine.world);
        Engine.clear(engine);
        engine.events = {}
        btn.addEventListener('click', function (){
            window.location.reload()
        })
    }
})

let bricks = []
for (let x = groundX + 25; x <= play_width + 100 ; x += 50) {
	for (let y = groundY +10; y < height/2; y += 50) {
		let brick = Bodies.rectangle(x, y, 40, 40, staticPerfectProperty)
		brick.label = 'brick'
		brick.render.strokeStyle = randomColorString()
		brick.render.lineWidth = 3
		bricks.push(brick)
	}
}

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
        let btn = document.createElement("button")
        btn.innerHTML = "Replay"
        document.body.appendChild(btn)
        World.clear(engine.world);
        Engine.clear(engine);
        engine.events = {}
        btn.addEventListener('click', function (){
            window.location.reload()
        })
    }

});
let bar_initialposition = {x:width / 2, y:height - 100 }
let bar = Bodies.rectangle(width / 2, height - 100, 150, 20, staticPerfectProperty)
bar.render.fillStyle = 'red'

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

World.add(engine.world, [ball, bar,...bricks, ...walls])
Engine.run(engine)
Render.run(render)

function mapy(variable1, min1, max1, min2, max2){
    variable1 = min2+(max2-min2)*((variable1-min1)/(max1-min1))
    return variable1
}