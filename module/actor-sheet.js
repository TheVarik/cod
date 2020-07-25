/**
 * Extend the basic ActorSheet with listeners for rolls
 * @extends {ActorSheet}
 */

export class ActorSheetCoD extends ActorSheet {
	//Extend and override the default options

	static get defaultOptions() {
		const options = super.defaultOptions;
		const path = 'systems/cod/templates/actor';
		options.tabs = [
			{navSelector: '.tabs', contentSelector: '.content', initial: 'display'},
		];
		options.classes = options.classes.concat(['cod', 'mortal', 'actor-sheet']);
		options.template = `${path}/actor-sheet.html`;
		options.width = 610;
		options.height = 610;
		return options;
	}

	getData() {
		const data = super.getData();

		// Prepare inventory
		this._prepareItems(data.actor);

		// Prepare attributes & skills for dialog selections
		data.data.sortedAttributes = this.sortAttrGroups();
		data.data.sortedSkills = this.sortSkillGroups();

		// Prepare health, willpower, attribute, and skill dots
		this._configureDots(data.actor.data);

		// Provide splat info to sheet
		data.splats = CONFIG.splats;

		// Prep tabs
		data.tabs = {
			display: {
				data: 'display',
				class: 'main',
				template: () => `systems/cod/templates/actor/actor-display.html`,
			},
			main: {
				data: 'main',
				class: 'main',
				template: () => `systems/cod/templates/actor/actor-main.html`,
			},
			merits: {
				data: 'merits',
				class: 'merits',
				template: () => `systems/cod/templates/actor/actor-merits.html`,
			},
			vamptraits: {
				data: 'vamptraits',
				class: 'vamptraits',
				template: () => `systems/cod/templates/actor/actor-vamptraits.html`,
			},
			wolftraits: {
				data: 'wolftraits',
				class: 'wolftraits',
				template: () => `systems/cod/templates/actor/actor-wolftraits.html`,
			},
			magetraits: {
				data: 'magetraits',
				class: 'magetraits',
				template: () => `systems/cod/templates/actor/actor-magetraits.html`,
			},
			equipment: {
				data: 'equipment',
				class: 'equipment',
				template: () => `systems/cod/templates/actor/actor-equipment.html`,
			},
			status: {
				data: 'status',
				class: 'status',
				template: () => `systems/cod/templates/actor/actor-status.html`,
			},
			rolls: {
				data: 'customrolls',
				class: 'customrolls',
				template: () => `systems/cod/templates/actor/actor-rolls.html`,
			},
			extra: {
				data: 'extra',
				class: 'extra',
				template: () => `systems/cod/templates/actor/actor-extra.html`,
			},
		};

		//Output current status
		console.log(`Current state of actor-sheet data:`);
		console.log(data);
		console.log(`------------------`);

		return data;
	}

	// Prepare Inventory
	_prepareItems(actorData) {
		actorData.data.inventory = {
			weapons: [],
			armors: [],
			equipments: [],
			vehicles: [],
			services: [],
			merits: [],
			disciplines: [],
			devotions: [],
			gifts: [],
			rites: [],
			fetishes: [],
			spells: [],
			attainments: [],
			magicaltools: [],
			conditions: [],
			tilts: [],
			dreads: [],
			numinas: [],
		};
		const inventory = actorData.data.inventory;

		for (let i of actorData.items) {
			if (i.type == 'weapon') {
				inventory.weapons.push(i);
			}
			if (i.type == 'armor') {
				inventory.armors.push(i);
			}
			if (i.type == 'equipment') {
				inventory.equipments.push(i);
			}
			if (i.type == 'vehicle') {
				inventory.vehicles.push(i);
			}
			if (i.type == 'service') {
				inventory.services.push(i);
			}
			if (i.type == 'merit') {
				inventory.merits.push(i);
			}
			if (i.type == 'discipline') {
				inventory.disciplines.push(i);
			}
			if (i.type == 'devotion') {
				inventory.devotions.push(i);
			}
			if (i.type == 'gift') {
				inventory.gifts.push(i);
			}
			if (i.type == 'rite') {
				inventory.rites.push(i);
			}
			if (i.type == 'fetish') {
				inventory.fetishes.push(i);
			}
			if (i.type == 'spell') {
				inventory.spells.push(i);
			}
			if (i.type == 'attainment') {
				inventory.attainments.push(i);
			}
			if (i.type == 'magical tool') {
				inventory.magicaltools.push(i);
			}
			if (i.type == 'condition') {
				inventory.conditions.push(i);
			}
			if (i.type == 'tilt') {
				inventory.tilts.push(i);
			}
			if (i.type == 'dread') {
				inventory.dreads.push(i);
			}
			if (i.type == 'numina') {
				inventory.numinas.push(i);
			}
		}
	}

	// Sort Attributes for display on roll pool dialogs
	sortAttrGroups() {
		let skills = duplicate(CONFIG.skills);
		let attributes = duplicate(CONFIG.attributes);
		let skillGroups = duplicate(CONFIG.groups);
		let attrGroups = duplicate(CONFIG.groups);

		for (let g in skillGroups) {
			skillGroups[g] = {};
			attrGroups[g] = {};
		}

		for (let s in skills) {
			let skillGroup = CONFIG.groupMapping[s];
			skillGroups[skillGroup][s] = skills[s];
		}
		for (let a in attributes) {
			let attrGroup = CONFIG.groupMapping[a];
			attrGroups[attrGroup][a] = attributes[a];
		}

		let displayAttrGroups = Object.keys(attrGroups)
			.map((key) => {
				const newKey = CONFIG.groups[key];
				return {[newKey]: attrGroups[key]};
			})
			.reduce((a, b) => Object.assign({}, a, b));

		for (let g in displayAttrGroups) {
			for (let a in displayAttrGroups[g]) {
				displayAttrGroups[g][a] +=
					' (' + this.actor.data.data.attributes[a].value + ')';
			}
		}
		return displayAttrGroups;
	}

	// Sort Skills for display on roll pool dialogs
	sortSkillGroups() {
		let skills = duplicate(CONFIG.skills);
		let attributes = duplicate(CONFIG.attributes);
		let skillGroups = duplicate(CONFIG.groups);
		let attrGroups = duplicate(CONFIG.groups);

		for (let g in skillGroups) {
			skillGroups[g] = {};
			attrGroups[g] = {};
		}

		for (let s in skills) {
			let skillGroup = CONFIG.groupMapping[s];
			skillGroups[skillGroup][s] = skills[s];
		}
		for (let a in attributes) {
			let attrGroup = CONFIG.groupMapping[a];
			attrGroups[attrGroup][a] = attributes[a];
		}

		let displaySkillGroups = Object.keys(skillGroups)
			.map((key) => {
				const newKey = CONFIG.groups[key];
				return {[newKey]: skillGroups[key]};
			})
			.reduce((a, b) => Object.assign({}, a, b));

		for (let g in displaySkillGroups) {
			for (let s in displaySkillGroups[g]) {
				displaySkillGroups[g][s] +=
					' (' + this.actor.data.data.skills[s].value + ')';
			}
		}
		return displaySkillGroups;
	}

	// Create HP/WP/Att/Skill dot objects
	_configureDots(actorData) {
		let attributes = duplicate(CONFIG.attributes);
		let skills = duplicate(CONFIG.skills);
		switch(actorData.splatSelect.value){
			case "vampire":
				actorData.vamp_dots = {
					bpDots: [],
					vtMaxDots: [],
					vtCurrentDots: [],
				};
				for (let i = 0; i < actorData.vamp_advantages.bloodpotency.value; i++){
					actorData.vamp_dots.bpDots.push({
						full:true,
					});
				};
				for (let i = 0; i < actorData.vamp_advantages.vitae.max; i++){
					actorData.vamp_dots.vtMaxDots.push({
						full:true,
					});
				};
				for (let i = 0; i < actorData.vamp_advantages.vitae.value; i++){
					actorData.vamp_dots.vtCurrentDots.push({
						full:true,
					});
				};
				break;
		}
		actorData.dots = {
			hpMaxDots: [],
			hpCurrentDots: [],
			wpMaxDots: [],
			wpCurrentDots: [],
			integDots: [],
			attDots: [],
			skillDots: [],
		};

		// Configure HP max dots
		for (let i = 0; i < actorData.advantages.hp.max; i++) {
			actorData.dots.hpMaxDots.push({
				full: true,
			});
		}


		// Configure WP max dots
		for (let i = 0; i < actorData.advantages.wp.max; i++) {
			actorData.dots.wpMaxDots.push({
				full: true,
			});
		}
		// Configure WP current dots
		for (let i = 0; i < actorData.advantages.wp.value; i++) {
			actorData.dots.wpCurrentDots.push({
				full: true,
			});
		}

		// Configure Integrity current dots
		for (let i = 0; i < actorData.advantages.integrity.value; i++) {
			actorData.dots.integDots.push({
				full: true,
			});
		}

		// Configure Attribute dots
		for (let a in attributes) {
			actorData.dots.attDots[a] = [];
		}
		for (let a in attributes) {
			for (let i = 0; i < actorData.attributes[a].value; i++) {
				actorData.dots.attDots[a].push({
					full: true,
				});
			}
		}

		// Configure Skill dots
		for (let s in skills) {
			actorData.dots.skillDots[s] = [];
		}

		for (let s in skills) {
			for (let i = 0; i < actorData.skills[s].value; i++) {
				actorData.dots.skillDots[s].push({
					full: true,
				});
			}
		}
	}

	/* -------------------------------------------- */

	// Activate event listeners using the prepared sheet HTML

	activateListeners(html) {
		super.activateListeners(html);
		const path = 'systems/cod/templates';

		this._onBoxChange(html);
		// Click attribute/skill roll
		html.find('.roll-pool').click((event) => {
			let defaultSelection = $(event.currentTarget).attr('data-skill');

			let dialogData = {
				defaultSelectionAtt: defaultSelection,
				defaultSelectionSkill: defaultSelection,
				skills: this.sortSkillGroups(),
				attributes: this.sortAttrGroups(),
				groups: CONFIG.groups,
			};

			renderTemplate(`${path}/pool-dialog.html`, dialogData).then((html) => {
				new Dialog({
					title: 'Roll Dice Pool',
					content: html,
					buttons: {
						Yes: {
							icon: '<i class="fa fa-check"></i>',
							label: 'Yes',
							callback: (html) => {
								let attributeSelected = html
									.find('[name="attributeSelector"]')
									.val();
								let poolModifier = html.find('[name="modifier"]').val();
								let skillSelected = html.find('[name="skillSelector"]').val();
								let exploderSelected = html
									.find('[name="exploderSelector"]')
									.val();
								if (attributeSelected === 'none' || skillSelected === 'none')
									console.log(`Invalid pool selected.`);
								else
									this.actor.rollPool(
										attributeSelected,
										skillSelected,
										poolModifier,
										exploderSelected
									);
								console.log(``);
							},
						},
						cancel: {
							icon: '<i class="fas fa-times"></i>',
							label: 'Cancel',
						},
					},
					default: 'Yes',
				}).render(true);
			});
		});

		// Click weapon roll
		html.find('.weapon-roll').click((event) => {
			let itemId = $(event.currentTarget).parents('.item').attr('data-item-id');
			let item = this.actor.getEmbeddedEntity('OwnedItem', itemId);
			let weaponName = item.name;
			let attackType = item.data.attack.value;
			let damage = item.data.damage.value;
			let formula = CONFIG.attackSkills[attackType];
			formula = formula.split(',');
			// Formula[0] = attribute, Formula[1] = skill (e.g., 'str', 'brawl')

			let defaultSelectionAtt = formula[0];
			let defaultSelectionSkill = formula[1];

			let dialogData = {
				defaultSelectionAtt: defaultSelectionAtt,
				defaultSelectionSkill: defaultSelectionSkill,
				skills: this.sortSkillGroups(),
				attributes: this.sortAttrGroups(),
				groups: CONFIG.groups,
			};

			// If a target is selected
			if (game.user.targets.size == 1) {
				let target = game.user.targets.values().next().value.actor.data.name;
				let targetDef =
					-1 *
					game.user.targets.values().next().value.actor.data.data.advantages.def
						.value;

				if (attackType === 'ranged') {
					console.log(`Target's defense not applied`);
					this.actor.weaponRollPool(
						formula[0],
						formula[1],
						0,
						'ten',
						weaponName,
						damage,
						target
					);
					console.log(``);
				} else {
					this.actor.weaponRollPool(
						formula[0],
						formula[1],
						targetDef,
						'ten',
						weaponName,
						damage,
						target
					);
					console.log(``);
				}
			} else {
				// If no target selected, create popup dialogue
				renderTemplate(`${path}/pool-dialog.html`, dialogData).then((html) => {
					new Dialog({
						title: 'Roll Dice Pool',
						content: html,
						buttons: {
							Yes: {
								icon: '<i class="fa fa-check"></i>',
								label: 'Yes',
								callback: (html) => {
									let attributeSelected = html
										.find('[name="attributeSelector"]')
										.val();
									let poolModifier = html.find('[name="modifier"]').val();
									let skillSelected = html.find('[name="skillSelector"]').val();
									let exploderSelected = html
										.find('[name="exploderSelector"]')
										.val();
									if (attributeSelected === 'none' || skillSelected === 'none')
										console.log(`Invalid pool selected.`);
									else
										this.actor.weaponRollPool(
											attributeSelected,
											skillSelected,
											poolModifier,
											exploderSelected,
											weaponName,
											damage,
											'none'
										);
									console.log(``);
								},
							},
							cancel: {
								icon: '<i class="fas fa-times"></i>',
								label: 'Cancel',
							},
						},
						default: 'Yes',
					}).render(true);
				});
			}
		});

		// Click attribute task roll
		html.find('.att-roll-pool').click((event) => {
			let dialogData = {
				attributes: this.sortAttrGroups(),
				groups: CONFIG.groups,
			};

			renderTemplate(`${path}/att-pool-dialog.html`, dialogData).then(
				(html) => {
					new Dialog({
						title: 'Roll Dice Pool',
						content: html,
						buttons: {
							Yes: {
								icon: '<i class="fa fa-check"></i>',
								label: 'Yes',
								callback: (html) => {
									let attribute1Selected = html
										.find('[name="attribute1Selector"]')
										.val();
									let attribute2Selected = html
										.find('[name="attribute2Selector"]')
										.val();
									let poolModifier = html.find('[name="modifier"]').val();

									let exploderSelected = html
										.find('[name="exploderSelector"]')
										.val();
									if (
										attribute1Selected === 'none' &&
										attribute2Selected === 'none'
									)
										console.log(`Invalid pool selected.`);
									else
										this.actor.attTaskPool(
											attribute1Selected,
											attribute2Selected,
											poolModifier,
											exploderSelected
										);
									console.log(``);
								},
							},
							cancel: {
								icon: '<i class="fas fa-times"></i>',
								label: 'Cancel',
							},
						},
						default: 'Yes',
					}).render(true);
				}
			);
		});

		// Click custom roll 'Roll' button
		html.find('.roll-button').mousedown((ev) => {
			let rollIndex = Number(
				$(ev.currentTarget).parents('.rolls').attr('data-index')
			);
			let thisRoll = this.actor.data.data.rolls[rollIndex];
			if (thisRoll.exploder === undefined) {
				thisRoll.exploder = 'ten';
			}
			this.actor.rollPool(
				thisRoll.primary,
				thisRoll.secondary,
				thisRoll.modifier,
				thisRoll.exploder
			);
		});

		// Drag events for macros.
		if (this.actor.owner) {
			let handler = (ev) => this._onDragItemStart(ev);
			// Find all items on the character sheet.
			html.find('li.item').each((i, li) => {
				// Ignore for the header row.
				if (li.classList.contains('item-header')) return;
				// Add draggable attribute and dragstart listener.
				li.setAttribute('draggable', true);
				li.addEventListener('dragstart', handler, false);
			});
		}

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) return;

		// Update Inventory Item
		html.find('.item-edit').click((ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.find(
				(i) => i.id == li.attr('data-item-id')
			);
			item.sheet.render(true);
		});

		// Delete Inventory Item
		html.find('.item-delete').click((ev) => {
			const li = $(ev.currentTarget).parents('.item');
			let defaultSelection = 'Cancel';
			let dialogData = {
				defaultSelection: defaultSelection,
			};
			renderTemplate(`${path}/del-confirm.html`, dialogData).then((html) => {
				new Dialog({
					title: 'Confirm deletion',
					content: html,
					buttons: {
						Yes: {
							icon: '<i class="fa fa-check"></i>',
							label: 'Yes',
							callback: (html) => {
								this.actor.deleteEmbeddedEntity('OwnedItem', li.data('itemId'));
								li.slideUp(200, () => this.render(false));
							},
						},
						cancel: {
							icon: '<i class="fas fa-times"></i>',
							label: 'Cancel',
						},
					},
					default: 'Yes',
				}).render(true);
			});
		});

		// Add item
		html.find('.item-add').click((ev) => {
			const type = $(ev.currentTarget).attr('data-item-type');
			if (type != 'roll')
				this.actor.createEmbeddedEntity('OwnedItem', {
					type: type,
					name: `New ${type.capitalize()}`,
				});
			else {
				let rolls = duplicate(this.actor.data.data.rolls);
				rolls.push({name: 'New Roll', exploder: 'ten'});
				this.actor.update({'data.rolls': rolls});
			}
		});

		// Update roll name
		html.find('.roll-name').change((ev) => {
			let rollIndex = $(ev.currentTarget).parents('.rolls').attr('data-index');
			let newName = ev.target.value;
			let rollList = duplicate(this.actor.data.data.rolls);
			rollList[rollIndex].name = newName;
			this.actor.update({'data.rolls': rollList});
		});

		// Delete roll
		html.find('.roll-delete').click((ev) => {
			let rollIndex = Number(
				$(ev.currentTarget).parents('.rolls').attr('data-index')
			);
			let rollList = duplicate(this.actor.data.data.rolls);
			rollList.splice(rollIndex, 1);
			this.actor.update({'data.rolls': rollList});
		});

		// Change custom roll attribute
		html.find('.roll.attribute-selector').change((ev) => {
			let rollIndex = Number(
				$(ev.currentTarget).parents('.rolls').attr('data-index')
			);
			let primary = $(ev.currentTarget).hasClass('primary');
			let secondary = $(ev.currentTarget).hasClass('secondary');
			let modifier = $(ev.currentTarget).hasClass('modifier');
			let exploder = $(ev.currentTarget).hasClass('exploder');
			let rollList = duplicate(this.actor.data.data.rolls);

			if (primary) rollList[rollIndex].primary = ev.target.value;
			if (secondary) rollList[rollIndex].secondary = ev.target.value;
			if (modifier) rollList[rollIndex].modifier = Number(ev.target.value);
			if (exploder) rollList[rollIndex].exploder = ev.target.value;

			this.actor.update({'data.rolls': rollList});
		});


	}
_onBoxChange(html){
			let parent = html.find('.HealthTracker');
			parent.toArray().forEach(tracker => {
				if (!tracker.dataset.active) {
					let td = tracker.dataset;
					let trackerName = td.name || 'unknowntracker';
					let trackerNameDelimiter = '.';
					let tType = (td.type) ? td.type : 'oneState';
					let stateOrder = (td.states) ? td.states.split('/') : ['off', 'on'];
					let initialStateCount = stateOrder.map(v => (td[v]) ? td[v] * 1 : 0).map((v, k, a) => ((k > 0) ? a[0] - v : v)).map( v => (v < 0)?0:v ); //let initialStateCount = stateOrder.map( v => (td[v])?td[v]*1:0 );
					let limit = stateOrder.length - 1;
					let dots = [...Array(initialStateCount[0])].map(v => 0);
					let extraContent = () => '';
					let ex = {};
					tracker.dataset.active = 1;
					let renderBox = tracker.appendChild(document.createElement('div'));
					let inputs = stateOrder.map((v, k) => {
						if (k === 0) {
							tracker.insertAdjacentHTML('afterbegin', `<div class="niceNumber" onpointerdown="let v = event.target.textContent;let i= this.querySelector('input');if(v=='+'){i.value++}if(v=='−'){i.value--};i.dispatchEvent(new Event('input',{'bubbles':true}));">
               <input name="${trackerName + trackerNameDelimiter + v}" type="number" value="${initialStateCount[k]}">
               <div class="numBtns"><div class Name {

}="plusBtn">+</div><div class="minusBtn">−</div></div>
              </div>`);
							return tracker.firstChild;
						} else {
							let i = document.createElement('input');
							i.type = 'hidden';
							i.name = trackerName + trackerNameDelimiter + v
							i.value = initialStateCount[0] - initialStateCount[k]; //i.value = initialStateCount[k];
							return tracker.insertAdjacentElement('afterbegin', i);
				}
			});

			initialStateCount.slice(1).forEach((sCount, stateN) => {
				let stateNum = stateN + 1;
				[...Array(Math.min(sCount, dots.length))].forEach((v, k) => dots[k] = stateNum);
        });

			let renderBoxes = () => {
				renderBox.innerHTML =
					'<div class="boxes">' + dots.reduce((a, v, k) => a + `<div data-state="${v}" data-index="${k}"></div>`, '') + '</div>' + extraContent();
			};

			let updateDots = (num, index = false) => {
				let abNum = Math.abs(num);
				if (index) {
					if (num > 0) {
						dots = dots.map((dot, i) => (dot < num && i <= index) ? num : dot)
					} else if (num < 0) {
						dots = dots.map((dot, i) => (dot <= abNum && dot > 0 && i >= index) ? 0 : dot)
					}
				} else {
					if (num > 0) {
						let updateIndex = dots.findIndex(v => (v < num));
						if (updateIndex > -1) {
							dots[updateIndex] = num;
						} else {
							if (num < limit) {
								updateDots(num * 1 + 1); //Never gets called
							}
						}
					} else if (num < 0) {
						//let updateIndex = dots.reduce( (a,v,k) => (v == (num*-1) && v > 0)?k:a, -1 );
						let updateIndex = dots.findIndex(v => (v <= abNum && v > 0));

						if (updateIndex > -1) {
							dots[updateIndex] = 0; // dots.map( (v,k) => (k >= updateIndex)?0:v );
						}
					}
				}
				dots.sort().reverse();

				// Special states
				if (tType == 'health') {
					ex.dicePenalty = -1 * dots.slice(-limit).reduce((a, v) => (v > 0) ? a + 1 : a, 0);
					ex.penaltyState = dots[dots.length - 1];
				}

				// update inputs
				stateOrder.forEach((state, stateNum) => {
					let sCount = dots.length - dots.reduce((a, d) => (d >= stateNum) ? ++a : a, 0); //let sCount = dots.reduce((a, d) => (d >= stateNum) ? ++a : a, 0);
					let iName = trackerName + trackerNameDelimiter + state;
					let i = inputs.find(v => (v.name && v.name == iName));
					let ele = inputs.find(v => (v.name && v.name == iName));
					let oldValue = (ele) ? +ele.value * 1 : false;
					if (oldValue !== false && oldValue != sCount) {
						//if(iName === "data.health.bashing") this.actor.update({'data.health.value': this.actor.data.data.health.max - sCount});
						i.value = sCount;/**
											i.dispatchEvent(new Event('input', {
											'bubbles': true
											}));**/
					}
				});
				//inputs[0].dispatchEvent(new Event('change',{'bubbles':true}));
				renderBoxes();
				if(num !== 0){
					parent.submit();
				}
			};

			if (tType == 'health') {
				ex.dicePenalty = 0;
				ex.penaltyState = 0;
				ex.penaltyMap = {
					'0': 'physically stable',
					'1': 'losing consciousness',
					'2': 'bleeding out',
					'3': 'dead'
				};

				extraContent = () => `<div class="info"><span>You are <b>${ex.penaltyMap[ex.penaltyState]}</b>.</span><span>Dice Penalty:  <b>−${Math.abs(ex.dicePenalty)}</b></span></div>`;
			}

			if (this.options.editable) {
				tracker.addEventListener('pointerdown', (e, t = e.target) => {
					if (t.dataset.state) {
						let s = t.dataset.state * 1;
						let n = s;
						let index = false;
						if (e.button === 2) {
							n = -s;
						} else {
							n = s + 1;
						}
						if (tType == 'oneState' && t.dataset.index) {
							index = t.dataset.index;
						}
						updateDots((n > limit) ? -limit : n, index);
						//parent.submit();
					}
				});
				tracker.addEventListener('input', (e, t = e.target) => {
					if (t.type == 'number') {
						let nl = +t.value * 1;
						if (nl < dots.length) {
							dots = dots.slice(0, +t.value * 1);
						} else if (nl > dots.length) {
							dots.push(...[...Array(nl - dots.length)].map(v => 0));
						}

						updateDots(0);
					}
				});
			}
					updateDots(0);
					tracker.dataset.active = 1;
				}
			});
}
}
