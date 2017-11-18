var topLevel;
var app = {
    // Register an event handler that is invoked when the device is ready.
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // Start swarmlet when the device is ready.
    onDeviceReady: function() {
        topLevel = instantiateAccessor('MyTopLevel', 'Swarmlet', getAccessorCode);
        topLevel.initialize();
        this.updateStatus('Executing'); // FIXME: handle wrap up
    },

    // Update Status
    updateStatus: function(id) {
        document.getElementById('status').querySelector(".msg").innerHTML = id;
    },

    handleUserInput: function() {
        x = document.getElementById("command").elements["show_select"].value;
        topLevel.provideInput('input', x);
    }
};

app.initialize();