const { Transaction } = require('../../models');
const ObjectId = require('mongoose').Types.ObjectId;

const getStatistics = async (req, res, next) => {
  try {
    const { _id } = req.user;
    console.log('req.params:', req.params);
    const { year, month } = req.statParams;
console.log("req.statParams:", req.statParams);

    const result = await Transaction.aggregate([
      {
        $addFields: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
      },
      {
        $match: {
          owner: ObjectId(_id),
          year: year,
          month: month,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      {
        $unwind: '$categoryData',
      },
      {
        $group: {
          _id: { 
            year: { $year: "$date" },
            month: { $month: "$date" },
            income: '$income', 
            category: '$categoryData.nameStatistics' },
            categorySum: { $sum: { "$toDouble": '$amount'} 
          },
        },
      },
      {
        $group: {
          _id: { 
            year: '$_id.year',
            month: '$_id.month',
            income: '$_id.income' },
          categories: {
            $push: { 
              category: '$_id.category', 
              categorySum: { $round: ['$categorySum', 2] } },
          },
          totalSum: { $sum: '$categorySum' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          income: '$_id.income',
          categories: '$categories',
          totalSum: { $round: ['$totalSum', 2] },
        },
      },
    ]);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = getStatistics;