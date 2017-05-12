(function () {
	/* If a single panel is reloaded by right clicking on it and hitting "Reload frame",
	 * it will attach duplicate paper-toast nodes to the top DOM. This block finds those
	 * old paper-toast nodes and removes them.
	 */
	const dashboardDoc = findDashboardDoc();
	const now = Date.now();
	const pathname = window.location.pathname;
	const oldNodes = dashboardDoc.querySelectorAll(`paper-toast[pathname="${pathname}"]:not([timestamp="${now}"])`);
	for (let i = 0; i < oldNodes.length; i++) {
		dashboardDoc.body.removeChild(oldNodes[i]);
	}

	function findDashboardDoc() {
		try {
			let parent = window.parent;
			while (parent && parent !== parent.parent) {
				if (parent.__nodecg__) {
					return parent.document;
				}

				parent = parent.parent;
			}

			return parent.document;
		} catch (e) {
			return window.document;
		}
	}

	Polymer({
		is: 'nodecg-toast',

		properties: {
			/**
			 * The duration in milliseconds to show the toast.
			 */
			duration: {
				type: Number,
				value: 3000,
				observer: '_durationChanged'
			},

			/**
			 * The text to display in the toast.
			 */
			text: {
				type: String,
				value: '',
				observer: '_textChanged'
			}
		},

		// Set up content observer and toaster.
		attached() {
			this.toaster = dashboardDoc.createElement('paper-toast');
			this.toaster.setAttribute('pathname', pathname);
			this.toaster.setAttribute('timestamp', now);
			this.toaster.duration = this.duration;
			this.toaster.text = this.text;
			this._observer = Polymer.dom(this.$.contentNode).observeNodes(this._contentChanged);
			dashboardDoc.body.appendChild(this.toaster);
		},

		detached() {
			dashboardDoc.body.removeChild(this.toaster);
		},

		/**
		 * Show the toast.
		 * @method show
		 */
		show() {
			this.toaster.show.apply(this.toaster, arguments);
		},

		/**
		 * Hide the toast
		 */
		hide() {
			this.toaster.hide.apply(this.toaster, arguments);
		},

		_durationChanged() {
			if (!this.toaster) {
				return;
			}

			this.toaster.duration = this.duration;
		},

		_textChanged() {
			if (!this.toaster) {
				return;
			}

			this.toaster.text = this.text;
		},

		_contentChanged() {
			// Remove any existing content from the toaster.
			while (this.toaster.firstChild) {
				this.toaster.removeChild(this.toaster.firstChild);
			}

			// Clone the current content in the toaster.
			const distributedNodes = Polymer.dom(this.$.contentNode).getDistributedNodes();
			distributedNodes.forEach(node => {
				Polymer.dom(this.toster).appendChild(node.cloneNode(true));
			});
		}
	});
})();
