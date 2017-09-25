

var api = {
    cache: {},
    baseUrl: '/api/v1',

    ajax: function () {
        var url, args;

        /**
          Parse arguments. Supports e.g. `ajax('/some-uri', { type: 'GET' })`
          and `ajax({ url: '/some-uri', type: 'GET' })` and so on.
        */
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'string') {
                url = arguments[0];
                args = {};
            } else {
                args = arguments[0];
                url = args.url;
                delete args.url;
            }
        } else if (arguments.length === 2) {
            url = arguments[0];
            args = arguments[1];
        }

        // Default to GET
        if (!args.type) {
            args.type = 'GET';
        }

        // Default to JSON with GET
        if (!args.dataType && args.type === 'GET') {
            args.dataType = 'json';
        }

        if (!args.errorHandler) {
            args.errorHandler = this.errorHandler;
        }

        return $.ajax(this.buildURL(url), args);
    },

    buildURL: function(url) {
        // If it's an absolute URL, return it
        if (url.indexOf('http') === 0) {
            return url;
        }

        return this.baseUrl + url;
    },

    errorHandler: function(req, textStatus, errorThrown) {
        var _this = this;
        if (req.status === 401) {
            // TODO: what do?
        }
    },

    //register user

    register: function(data){
        return this.ajax('/', {
            type: 'POST',
            dataType: 'JSON',
            data: data,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
                xhr.setRequestHeader('Authorization', DEFAULT_SETTINGS.jwt)
            },
        });
    },

    //logged in user
    login: function(data){
        return this.ajax('/sign_in', {
            type: 'POST',
            dataType: 'JSON',
            data: data,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
                xhr.setRequestHeader('Authorization', DEFAULT_SETTINGS.jwt)
            },
        });
    },

    //resetPassword  password
    resetPassword: function(data){
        return this.ajax('/password', {
            type: 'POST',
            dataType: 'JSON',
            data: data,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
                xhr.setRequestHeader('Authorization', DEFAULT_SETTINGS.jwt)
            },
        });
    },

  //resetPassword  password
    getLocations: function(){
        return this.ajax('/locations', {
            type: 'GET',
            dataType: 'JSON',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
                xhr.setRequestHeader('Authorization', DEFAULT_SETTINGS.jwt)
            },
        });
    },

    //getLessonStatus 
    getLessonStatus: function(){
        return this.ajax('/lesson_statuses', {
            type: 'GET',
            dataType: 'JSON',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
                xhr.setRequestHeader('Authorization', DEFAULT_SETTINGS.jwt)
            },
        });
    },


    //getSections
    get:function(url){
        return this.ajax(url, {
            type: 'GET',
            dataType: 'JSON',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
                xhr.setRequestHeader('Authorization', DEFAULT_SETTINGS.jwt)
            },
        });
    },

    post:function(url, data){
        return this.ajax(url, {
            type: 'POST',
            dataType: 'JSON',
            data: data,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
                xhr.setRequestHeader('Authorization', DEFAULT_SETTINGS.jwt)
            },
        });
    },
    
    put:function(url, data){
        return this.ajax(url, {
            type: 'PUT',
            dataType: 'JSON',
            data: data,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
                xhr.setRequestHeader('Authorization', DEFAULT_SETTINGS.jwt)
            },
        });
    },


    delete:function(url, data){
        return this.ajax(url, {
            type: 'DELETE',
            dataType: 'JSON',
            data: data,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
                xhr.setRequestHeader('Authorization', DEFAULT_SETTINGS.jwt)
            },
        });
    },
    
};

export default api;