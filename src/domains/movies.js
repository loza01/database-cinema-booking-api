const prisma = require("../utils/prisma")

const getAllMoviesDb = async ({ runtimeLt, runtimeGt }) => {
  runtimeGt = parseInt(runtimeGt)
  runtimeLt = parseInt(runtimeLt)

  const movieQuery = {
    include: {
      screenings: true,
    },
  }

  if (runtimeLt) {
    movieQuery.where = {
      runtimeMins: {
        lt: runtimeLt,
      },
    }
  }

  if (runtimeGt) {
    movieQuery.where = {
      runtimeMins: {
        gt: runtimeGt,
      },
    }
  }

  return await prisma.movie.findMany(movieQuery)
}

const getMovieByIdDb = async (id) =>
  await prisma.movie.findUnique({
    where: {
      id: id,
    },
    include: {
      screenings: true,
    },
  })

const createMovieDb = async (title, runtimeMins) =>
  await prisma.movie.create({
    data: {
      title: title,
      runtimeMins: runtimeMins,
    },
    include: {
      screenings: true,
    },
  })

const updateMovieByIdDb = async (request_body, id) => {
  const { title, runtimeMins, screenings } = request_body

  const dataToUpdate = {}

  if (title) {
    dataToUpdate.title = title
  }

  if (runtimeMins) {
    dataToUpdate.runtimeMins = runtimeMins
  }

  if (screenings) {
    dataToUpdate.screenings = {
      update: {
        movieId: screenings.movieId,
        screenId: screenings.screenId,
        startsAt: screenings.startsAt,
      },
    }
  }

  const updatedMovie = await prisma.movie.update({
    where: { id: id },
    data: dataToUpdate,
    include: {
      screenings: true,
    },
  })

  return updatedMovie
}

module.exports = {
  getAllMoviesDb,
  createMovieDb,
  getMovieByIdDb,
  updateMovieByIdDb,
}