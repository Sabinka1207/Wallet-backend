const { Transaction } = require('../../models');
const ObjectId = require('mongoose').Types.ObjectId;

const getStatistics = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { year, month } = req.statParams;
console.log("req.statisticsParams:", req.statisticsParams);

    const result = await Transaction.aggregate([
      {
        $match: {
          owner: ObjectId(_id),
        },
      },
      {
        $addFields: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
      },
      {
        $match: {
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
          _id: { income: '$income', category: '$categoryData.nameStatistics' },
          categorySum: { $sum: {
            "$toDouble": '$amount'} 
          },
        },
      },
      {
        $group: {
          _id: { income: '$_id.income' },
          categories: {
            $push: { category: '$_id.category', categorySum: { $round: ['$categorySum', 2] } },
          },
          totalSum: { $sum: '$categorySum' },
        },
      },
      {
        $project: {
          _id: 0,
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