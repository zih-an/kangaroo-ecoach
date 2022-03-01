# 袋鼠教练 E-Coach

## 框架简介

在本项目是基于 Django 和 react-native 的运动健康应用，Django 是使用 python 语言编写的功能完整的服务器框架；React Native 是目前流行的跨平台移动应用开发框架之一，能够在 JavaScript 和 React 的基础上获得一致的开发体验。

### 后端：Django 项目目录介绍

```
ecoach-backend/
    manage.py
    demo/
        __init__.py
        settings.py
        urls.py
        wsgi.py
    polls/
        __init__.py
        admin.py
        apps.py
        migrations/
            __init__.py
        models.py
        tests.py
        views.py

```

- `manage.py`：用各种方式管理 Django 项目的命令行工具。
- `demo/`：一个纯 Python 包，它的名字就是引用它内部任何东西时需要用到的 Python 包名。
- `demo/__init__.py`：一个空文件，告诉 Python 这个目录应该被认为是一个 Python 包。
- `demo/settings.py`：Django 项目的配置文件。
- `demo/urls.py`：Django 项目的 URL 声明，就像网站的“目录”。
- `demo/wsgi.py`：作为项目的运行在 WSGI 兼容的 Web 服务器上的入口。
- `polls/`：一个应用或功能对应的全部内容。

### 前端：react-native

- `ecoach-frontend`文件夹内为 expo 版本
- `awsomeproject`文件夹内为 react native cli 版本
