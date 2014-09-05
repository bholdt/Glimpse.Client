var glimpse = require('glimpse'),
    requestRepository = require('../repository/request-repository.js'),
    // TODO: Not sure I need to store the requests
    _requests = {},
    _requestSelectedId = null;

function requestChanged(targetRequests) {
    glimpse.emit('shell.request.detail.changed', targetRequests);
}

// Clear Request
(function() {
    function clearRequest() {
        _requestSelectedId = null;

        requestChanged(null);
    }

    glimpse.on('shell.request.detail.closed', clearRequest);
})();

// Found Data
(function() {
    function dataFound(payload) {
        // TODO: Really bad hack to get things going atm
        _requests[payload.newRequest.id] = payload.newRequest;

        if (payload.newRequest.id === _requestSelectedId) {
            requestChanged(payload.newRequest);
        }
    }

    // External data coming in
    glimpse.on('data.request.detail.found', dataFound);
})();

// Trigger Requests
(function() {
    function triggerRequest(payload) {
        _requestSelectedId = payload.requestId;

        if (!FAKE_SERVER) {
            requestRepository.triggerGetDetailsFor(payload.requestId);
        }
    }

    glimpse.on('data.request.detail.requested', triggerRequest);
})();
