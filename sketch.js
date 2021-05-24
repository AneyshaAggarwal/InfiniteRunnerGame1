var sun;
var PLAY= 1;
var END= 0;
var gameState= PLAY;
var trex;
var edges;
var ground;
var ground2;
var ground3;
var score= 0;
var restart;
var gameOver;


function preload()
{
 trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
 trex_collided = loadAnimation("trex_collided.png");
 groundImage = loadImage("ground2.png"); 
 cloudsImage = loadImage("cloud.png");
 cactus1 = loadImage("obstacle1.png");
 cactus2 = loadImage("obstacle2.png");
 cactus3 = loadImage("obstacle3.png");
 cactus4 = loadImage("obstacle4.png");
 cactus5 = loadImage("obstacle5.png");
 cactus6 = loadImage("obstacle6.png");
 jumpSound = loadSound("jump.mp3");
 dieSound = loadSound("die.mp3");
 checkpointSound = loadSound("checkPoint.mp3");
 restartImage = loadImage("restart.png");
 GOI = loadImage("gameOver.png");
}

function setup() 
{
 createCanvas(600,200);

 edges = createEdgeSprites();
 trex = createSprite(50,160,20,50);
 ground = createSprite(300,180,600, 20);
 ground2 = createSprite(300,195,600, 5);
 ground3 = createSprite(300,200,600, 40);
 gameOver = createSprite(300,100,20,20);
 restart = createSprite(300,140,20,20);
  
 ground3.shapeColor = "lightgreen"
  
 trex.addAnimation("running", trex_running);
 ground.addImage(groundImage);
 trex.addAnimation("collided", trex_collided);
 gameOver.addImage(GOI);
 restart.addImage(restartImage);
  
 trex.scale = 0.5;
 gameOver.scale = 2;
 restart.scale = 0.5;
  
 trex.x = 50;
 ground.x= ground.width/2;
 ground2.visible= false;
  
 obstacleGroup= new Group();
 cloudGroup= new Group();
 
 //trex.debug= true;
 trex.setCollider("circle", 0, 0, 45);
}

function draw() 
{
    background("skyblue");
    trex.collide(ground2);
    console.log(trex.y);

    //camera.position.x= displayWidth/2;
    //camera.position.y= trex.y;
 
    if(gameState === PLAY)
    {
        restart.visible= false;
        gameOver.visible= false;
        ground.velocityX= -10;

        if(keyDown("space") || keyDown(UP_ARROW) && trex.y >= 170)
        {
            trex.velocityY = -10;
            jumpSound.play();
        }

        trex.velocityY = trex.velocityY + 0.5;

        if (ground.x < 0)
        {
            ground.x= ground.width/2;
        }

        score = Math.round(frameCount/60) + score;
        spawnClouds();
        spawnObstacles();

        if(obstacleGroup.isTouching(trex))
        {
            gameState= END;
            dieSound.play();
        }

        if (score%500 === 0 && score != 0)
        {
            checkpointSound.play();
        }
    }
 
    else if(gameState === END)
    {
        textSize(15)
        fill("grey")
        text("GAME OVER", 250, 100);

        ground.velocityX= 0;
        obstacleGroup.setVelocityXEach(0);
        cloudGroup.setVelocityXEach(0);
        trex.changeAnimation("collided", trex_collided);
        obstacleGroup.setLifetimeEach(-1);
        cloudGroup.setLifetimeEach(-1);
        trex.velocityY= 0;
        restart.visible= true;
        //gameOver.visible= true;
  
        if(mousePressedOver(restart) || keyDown("space"))
        {
            reset();
        }
    }
  
    ground3.depth= ground.depth;
    ground.depth= ground.depth+1;
    ground.depth= trex.depth;
    trex.depth = trex.depth + 1;
  
    text("Score: " + score, 500, 20, textSize(15), fill("black") );
  
    drawSprites();
}

function spawnClouds()
{
    if (frameCount%50 === 0)
    {
        var clouds = createSprite(600,50,40,10);
        clouds.addImage("cloud", cloudsImage);
        clouds.scale= 0.6;
        clouds.velocityX= -10;
        clouds.y= Math.round(random(50,110));
        trex.depth = clouds.depth;
        trex.depth = trex.depth + 1;
        clouds.lifetime = 60
        cloudGroup.add(clouds)
    }
}

function spawnObstacles()
{
    if (frameCount%80 === 0)
    {
        var cactus= createSprite(600, 170, 20, 40)
        cactus.velocityX= -(10 + score/200);
        var rand= Math.round(random(1,6))
        cactus.scale= 0.5;
        cactus.depth= ground3.depth;
        cactus.depth= cactus.depth + 1;
        cactus.lifetime = 60
        obstacleGroup.add(cactus)
  
        switch(rand)
        {
            case 1: cactus.addImage(cactus1);
            break;
            case 2: cactus.addImage(cactus2);
            break;
            case 3: cactus.addImage(cactus3);
            break;
            case 4: cactus.addImage(cactus4);
            break;
            case 5: cactus.addImage(cactus5);
            break;
            case 6: cactus.addImage(cactus6);
            break;
            default: break;
        }
    }
}

function reset()
{
    gameState= PLAY;
    obstacleGroup.destroyEach();
    cloudGroup.destroyEach();
    trex.changeAnimation("running", trex_running);
    score= 0;
}