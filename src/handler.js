const books = [];

const handleGet = (request, h) => {
  const { reading, finished, name } = request.query;

  let filteredBook = [];
  if (reading) {
    filteredBook = books.filter(book => book.reading == reading)
      .map(book => ({ id: book.id, name: book.name, publisher: book.publisher }));
  } else if (finished) {
    filteredBook = books.filter(book => book.finished == finished)
      .map(book => ({ id: book.id, name: book.name, publisher: book.publisher }));
  } else if (name) {
    filteredBook = books.filter(book => book.name.toLowerCase().includes(name.toLowerCase()))
      .map(book => ({ id: book.id, name: book.name, publisher: book.publisher }));
  } else {
    filteredBook = books.map(book => ({ id: book.id, name: book.name, publisher: book.publisher }));
  }

  return {
    status: "success",
    data: { books: filteredBook }
  };
}

const handleGetById = (request, h) => {
  const { id } = request.params;
  const filteredBook = books.filter(book => book.id == id);

  if (filteredBook.length == 0) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan"
    });

    response.code(404);
    return response;
  }

  return {
    status: "success",
    data: { book: filteredBook[0] }
  };
}

const handlePost = (request, h) => {
  const id = crypto.randomUUID();
  const finished = (request.payload.readPage == request.payload.pageCount) ? true : false;

  if (request.payload.readPage > request.payload.pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    });

    response.code(400);
    return response;
  }

  if (!request.payload.name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku"
    });

    response.code(400);
    return response;
  }

  const newData = {
    id: id,
    name: request.payload.name,
    year: request.payload.year,
    author: request.payload.author,
    summary: request.payload.summary,
    publisher: request.payload.publisher,
    pageCount: request.payload.pageCount,
    readPage: request.payload.readPage,
    finished: finished,
    reading: request.payload.reading,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  books.push(newData);

  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id
    }
  });
  response.code(201);
  return response;
}

const handlePut = (request, h) => {
  const { id } = request.params;

  if (request.payload.readPage > request.payload.pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
    });

    response.code(400);
    return response;
  }

  if (!request.payload.name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku"
    });

    response.code(400);
    return response;
  }

  const findIndex = books.findIndex((book) => book.id === id);

  if (findIndex == -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan"
    });

    response.code(404);
    return response;
  }


  // perbarui data
  books[findIndex] = { ...books[findIndex], ...request.payload, updatedAt: new Date().toISOString() };

  return {
    status: "success",
    message: "Buku berhasil diperbarui"
  };
}

const handleDelete = (request, h) => {
  const { id } = request.params;

  const findIndex = books.findIndex((book) => book.id === id);

  if (findIndex == -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan"
    });

    response.code(404);
    return response;
  }

  books.splice(findIndex, 1);

  return {
    status: "success",
    message: "Buku berhasil dihapus"
  };
}

module.exports = {
  handleGet,
  handleGetById,
  handlePost,
  handlePut,
  handleDelete,
}