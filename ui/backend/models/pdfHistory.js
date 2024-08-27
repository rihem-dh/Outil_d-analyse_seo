const mongoose = require('mongoose');

const pdfHistorySchema = new mongoose.Schema({
  userEmail: { 
    type: String, 
    required: true, 
    match: /.+\@.+\..+/},
  pdfName: { type: String, required: true },
  date: { type: Date, required: true },
});

const PDFHistory = mongoose.model('PDFHistory', pdfHistorySchema);

module.exports = PDFHistory;
