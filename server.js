const fastify = require("fastify")({ logger: true });

const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient();

const fetchLabels = async (imageBuffer) => {
  const [result] = await client.labelDetection({
    image: { content: imageBuffer}
  });
  return result.labelAnnotations
}

const fetchFaces = async (imageBuffer) => {
  const [result] = await client.faceDetection({
    image: { content: imageBuffer}
  });
  return result.faceAnnotations
}

const fetchLogos = async (imageBuffer) => {
  const [result] = await client.logoDetection({
    image: { content: imageBuffer}
  });
    console.log(result)
  return result.logoAnnonations
}

fastify.post("/labels", async (request, reply) => {
  const labels = await fetchLabels(new Buffer(request.body.image.split(",")[1], "base64"))
  reply.send({ labels });
});

fastify.post("/faces", async (request, reply) => {
  const faces = await fetchFaces(new Buffer(request.body.image.split(",")[1], "base64"))
    console.log(faces)
    console.log(faces[0].joyLikelihood)
    if (faces[0].joyLikelihood === 'VERY_LIKELY') {
        reply.send({ success: true });
    } else {
        reply.send({ success: false });
    }
});

fastify.post("/logos", async (request, reply) => {
  const logos = await fetchLogos(new Buffer(request.body.image.split(",")[1], "base64"))
    console.log(logos)
  reply.send({ logos });
});

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3002);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
