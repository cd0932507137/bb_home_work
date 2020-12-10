var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var config = require('./config.json');

var engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');
// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('etag');

var connection = mysql.createConnection({
    ...config,
    multipleStatements: true
});

// 首頁
app.get('/', function (req, res) {
    res.render('index');
});

// 登入
app.post('/login', function (req, res) {
    var params = [req.body.username, req.body.password];
    connection.query('select * from member_list WHERE username = ? AND password = ?', params, function (
        err,
        results,
        fields,
    ) {
        if (err) {
            throw err;
        } else {
            if (results.length === 0) {
                res.json({
                    statusCode: 500,
                    msg: 'failed',
                    data: null,
                });
            }
            if (results.length > 0) {
                connection.query('select * from permission_list WHERE permission_id = ?', results[0].authority, function (err, rows, fields) {
                    if (err) throw err;
                    if (rows.length > 0) {
                        permissionState = rows;
                        res.json({
                            statusCode: 200,
                            msg: 'success',
                            data: {
                                id: results[0].id,
                                username: results[0].username,
                                email: results[0].email,
                                authority: results[0].authority,
                                permission: permissionState,
                            },
                        });
                    }
                });
            }
        }
    });
});

// 註冊
app.post('/register', function (req, res, next) {
    var post = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        // 一般使用者
        authority: 1,
        created_at: req.body.created_at,
    };
    connection.query('INSERT INTO member_list SET ?', post, function (err, fields) {
        if (err) {
            throw err;
        } else {
            res.json({
                statusCode: 200,
                msg: 'success',
                data: null,
            });
        }
    });
});

// 前端首頁留言資料
app.get('/msg', function (req, res, next) {
    connection.query('select * from message_board', function (err, results, fields) {
        if (err) {
            throw err;
        } else {
            res.json({
                statusCode: 200,
                msg: 'success',
                data: results,
            });
        }
    });
});

// 前端留言版送出資料
app.post('/sendContent', function (req, res, next) {
    var post = {
        name: req.body.name,
        content: req.body.content,
        created_at: req.body.created_at,
    };
    connection.query('INSERT INTO message_board SET ?', post, function (err, fields) {
        if (err) {
            throw err;
        } else {
            res.json({
                statusCode: 200,
                msg: 'success',
                data: null,
            });
        }
    });
});

// 前端會員清單資料
app.get('/member', function (req, res) {
    connection.query('select * from member_list inner join permission_group_list on member_list.authority = permission_group_list.permission_id', function (err, results, fields) {
        if (err) {
            throw err;
        } else {
            res.json({
                statusCode: 200,
                msg: 'success',
                data: results,
            });
        }
    });
});

// 修改會員清單資料
app.put('/editMember', function (req, res, next) {
    var post = {
        id: req.body.id,
        username: req.body.username,
        email: req.body.email,
        authority: req.body.authority,
    };
    connection.query('update member_list set ? where id = ?', [post, req.body.id], function (err, fields) {
        if (err) {
            throw err;
        } else {
            res.json({
                statusCode: 200,
                msg: 'success',
                data: null,
            });
        }
    });
});

// 刪除會員清單資料
app.delete('/deleteMember', function (req, res, next) {
    console.log('req', req.body.id);
    connection.query('delete from member_list where id = ?', [req.body.id], function (err, fields) {
        if (err) {
            throw err;
        } else {
            res.json({
                statusCode: 200,
                msg: 'success',
                data: null,
            });
        }
    });
});

// 權限設定列表
app.get('/permission-setting', function (req, res) {
    connection.query('select * from permission_group_list', function (err, results, fields) {
        if (err) {
            throw err;
        } else {
            res.json({
                statusCode: 200,
                msg: 'success',
                data: results,
            });
        }
    });
});

// 取得權限內容
app.post('/permissionList', function (req, res, next) {
    var params = [req.body.permission_id];
    connection.query('select * from permission_list WHERE permission_id = ?', params, function (err, results, fields) {
        if (err) {
            throw err;
        } else {
            res.json({
                statusCode: 200,
                msg: 'success',
                data: results,
            });
        }
    });
});

// 取得路由設定檔
app.get('/routerConfigList', function (req, res) {
    connection.query('select * from router_config_list', function (err, results, fields) {
        if (err) {
            throw err;
        } else {
            res.json({
                statusCode: 200,
                msg: 'success',
                data: results,
            });
        }
    });
});

// 修改權限設定
app.put('/editPermission', function (req, res, next) {
    var params = req.body.data;
    let query = '';
    for (var i = 0, len = params.length; i < len; i++) {
        query += 'UPDATE permission_list SET operational_permission =' + params[i]['operational_permission'] + ',' + 'default_permission =' + params[i]['default_permission'] + ' WHERE id = ' + params[i]['id'] + ';';
    }
    connection.query(query, function (err, results, fields) {
        if (err) {
            throw err;
        } else {
            res.json({
                statusCode: 200,
                msg: 'success',
                data: null,
            });
        }
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// check running enviroment
var port = process.env.PORT || 4000;

app.listen(port);

if (port === 4000) {
    console.log('RUN http://localhost:4000/');
}
