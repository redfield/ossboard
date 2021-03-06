import Vue from 'vue/dist/vue.js'

import "../stylesheets/main.scss";

import "script-loader!./share_buttons.js";
import "!style-loader!css-loader!../stylesheets/share_buttons.css";

window.onload = function () {
  var taskTitleTag = document.getElementById('task_title');
  var taskTitle = taskTitleTag.textContent || taskTitleTag.innerText;
  var config = {
    networks: {
      googlePlus: {
        enabled: true,
      },
      twitter: {
        enabled: true,
        description: taskTitle
      },
      facebook: {
        enabled: true,
        loadSdk: true,
        title: taskTitle
      },
      reddit: {
        enabled: true,
        title: taskTitle
      },
      email: {
        enabled: true,
        description: taskTitle
      }
    }
  }
  var share = new ShareButton('.task__share', config);
}

var for_dev = new Vue({
  el: '#for-dev',
  data: {
    forDevelopers: true,
    forMaintainers: false
  },
  methods: {
    displayForDevelopers: function () {
      this.forDevelopers = true
      this.forMaintainers = false
    },

    displayForMaintainers: function () {
      this.forDevelopers = false
      this.forMaintainers = true
    }
  }
})

Vue.component('modal', {
  template: '#modal-template',
})

new Vue({
  el: '#import-modal',
  data: {
    showModal: false,
    hasError: false,
    errorMessage: '',
    exportingIssue: false,
    xhr: new XMLHttpRequest()
  },
  methods: {
    exportIssue: function () {
      var url = '/api/issue?issue_url=' + document.getElementById('issueUrl').value
      var self = this
      this.exportingIssue = true

      this.xhr.open('GET', url, true);
      this.xhr.setRequestHeader('Content-type', 'application/json');
      this.xhr.setRequestHeader('Accept', 'application/json');
      this.xhr.onload = function() {
        var data = JSON.parse(self.xhr.response)

        if (self.xhr.status == 200) {
          document.getElementById('task-title').value = data.title
          document.getElementById('task-issue-url').value = data.html_url
          document.getElementById('task-md-body').value = data.body
          self.showModal = false
        } else {
          self.hasError = true;
          self.errorMessage = 'Error: ' + data.error;
        }

        self.exportingIssue = false
      };
      this.xhr.send();
    }
  },
  created: function () {
    document.addEventListener("keydown", (e) => {
      if (this.showModal && e.keyCode == 27) {
        this.showModal = false;
      }
    });
  }
})

var agreementChackbox = document.getElementById("agreement-chackbox"),
    submitButton = document.getElementById("new-task-submit"),
    disableButtonReg = new RegExp('(\\s|^)pure-button-disabled(\\s|$)');

agreementChackbox.onchange = function() {
  if (agreementChackbox.checked) {
    submitButton.className = submitButton.className.replace(disableButtonReg, ' ');
  } else {
    submitButton.className += " pure-button-disabled";
  }
}
