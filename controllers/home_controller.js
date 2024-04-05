const Admin = require('../models/admin');
const Restaurant = require('../models/restaurant');
const Item = require('../models/item');
const Employee = require('../models/employee');
const Customer = require('../models/customer');
const Order = require('../models/order');

module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    return res.render('signin', { layout: false });
}
module.exports.add = function (req, res) {
    return res.render('tempform');
}
module.exports.create = function (req, res) {
    Restaurant.findOne({ username: req.body.username }, function (err, user) {
        if (err) { req.flash('error', 'error!'); return }

        if (!user) {
            Restaurant.create(req.body, function (err, user) {
                if (err) { req.flash('error', 'error!'); return }

                return res.redirect('/');
            })
        } else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/dashboard');
}
module.exports.dashboard = async function (req, res) {
    try {
        let restaurant = await Restaurant.find({});

        return res.render('dashboard', {
            restaurant: restaurant
        });

    } catch (err) {
        console.log(err);
        return;
    }

}
module.exports.edit = async function (req, res) {
    try {
        let restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success', 'Restaurant details Updated!');
        return res.redirect('back');
    } catch (err) {
        console.log(err);
    }


}
module.exports.additem = async (req, res) => {
    try {
        await Item.create(req.body);
        req.flash('success', 'Item added!');
        return res.redirect('back');
    } catch (error) {
        console.log(error);
    }

}
module.exports.deleteitem = async (req, res) => {
    try {
        let item = await Item.findById(req.params.id);
        item.remove();
        req.flash('success', 'Item deleted!');
        return res.redirect('back');
    } catch (error) {
        console.log(error);
    }
}
module.exports.addemployee = async (req, res) => {
    try {
        await Employee.create(req.body);
        req.flash('success', 'Employee added!');
        return res.redirect('back');
    } catch (error) {
        console.log(error);
    }

}
module.exports.deleteemployee = async (req, res) => {
    try {
        let item = await Employee.findById(req.params.id);
        item.remove();
        req.flash('success', 'Employee deleted!');
        return res.redirect('back');
    } catch (error) {
        console.log(error);
    }
}
module.exports.manage = async (req, res) => {
    let item = await Item.find({});
    let employee = await Employee.find({});
    return res.render('manage', {
        item: item,
        employee: employee
    });
}
module.exports.addorder = async (req, res) => {
    let item = await Item.find({});
    return res.render('addorder', {
        item: item
    });
}
module.exports.vieworder = async (req, res) => {
    let order = await Order.find({}).populate('customer');
    let ordcnt = order.length;

    let currDate = new Date();
    let oldDate = new Date();
    let oneMonth = new Date();
    oldDate = oldDate.setDate(currDate.getDate() - 7);
    oldDate = new Date(oldDate);
    oneMonth = oneMonth.setMonth(currDate.getMonth() - 1);
    oneMonth = new Date(oneMonth);

    let weekly = await Order.aggregate([{
        $match: {
            $and: [
                { createdAt: { $gte: oldDate } },
                { createdAt: { $lt: currDate } }
            ]
        }
    }, {
        $group: {
            _id: null,
            "no": {
                $sum: 1
            },
            "total": {
                $sum: "$total"
            },
            "count": {
                $sum: "$count"
            }
        }
    }]);
    let monthly = await Order.aggregate([{
        $match: {
            $and: [
                { createdAt: { $gte: oneMonth } },
                { createdAt: { $lt: currDate } }
            ]
        }
    }, {
        $group: {
            _id: null,
            "no": {
                $sum: 1
            },
            "total": {
                $sum: "$total"
            },
            "count": {
                $sum: "$count"
            }
        }
    }]);
    return res.render('vieworder', {
        order: order,
        ordcnt: ordcnt,
        weekly: weekly,
        monthly: monthly,
        oneMonth: oneMonth,
        oldDate: oldDate
    });
}
module.exports.addcustomer = async (req, res) => {
    try {
        let customer = await Customer.updateOne({ email: req.body.email }, req.body, {
            upsert: true
        });
        let cus = await Customer.findOne({ email: req.body.email });

        if (req.xhr) {
            return res.status(200).json({
                data: {
                    customer: cus
                },
                message: "Customer created!"
            });
        }

        req.flash('success', 'Customer Created!');
        return res.redirect('back');

    } catch (err) {
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.placeorder = async (req, res) => {
    try {
        let order = await Order.create(req.body);
        await order.populate('customer');
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    order: order
                },
                message: "Order Placed!!"
            });
        }
        req.flash('success', 'Order Placed!');
        return res.redirect('back');

    } catch (err) {
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
}