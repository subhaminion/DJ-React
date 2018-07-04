# DJ-Todo

# Local Setup

Python 3 and [Pipenv](https://docs.pipenv.org/) need to already be installed.

Clone the repo to your computer. For example, to place it on your `Desktop`.

```
$ cd ~/Desktop
$ git clone https://github.com/subhaminion/DJ-todo.git
$ cd DJ-todo
```

## Backend

Install the `Pipenv` packages and start a new shell. Then `cd` into the `djreact` directory and run the local server.

```
$ cd djreact
$ pipenv install
$ pipenv shell
(backend) $ ./manage.py runserver
```

You can see the API now at [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api).