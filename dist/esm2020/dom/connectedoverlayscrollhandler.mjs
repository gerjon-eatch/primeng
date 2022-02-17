import { DomHandler } from './domhandler';
export class ConnectedOverlayScrollHandler {
    constructor(element, listener = () => { }) {
        this.element = element;
        this.listener = listener;
    }
    bindScrollListener() {
        this.scrollableParents = DomHandler.getScrollableParents(this.element);
        for (let i = 0; i < this.scrollableParents.length; i++) {
            this.scrollableParents[i].addEventListener('scroll', this.listener);
        }
    }
    unbindScrollListener() {
        if (this.scrollableParents) {
            for (let i = 0; i < this.scrollableParents.length; i++) {
                this.scrollableParents[i].removeEventListener('scroll', this.listener);
            }
        }
    }
    destroy() {
        this.unbindScrollListener();
        this.element = null;
        this.listener = null;
        this.scrollableParents = null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGVkb3ZlcmxheXNjcm9sbGhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvZG9tL2Nvbm5lY3RlZG92ZXJsYXlzY3JvbGxoYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFeEMsTUFBTSxPQUFPLDZCQUE2QjtJQVF0QyxZQUFZLE9BQVksRUFBRSxXQUFnQixHQUFHLEVBQUUsR0FBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN2RTtJQUNMLENBQUM7SUFFRCxvQkFBb0I7UUFDaEIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzFFO1NBQ0o7SUFDTCxDQUFDO0lBRUQsT0FBTztRQUNILElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFDbEMsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEb21IYW5kbGVyfSBmcm9tICcuL2RvbWhhbmRsZXInO1xuXG5leHBvcnQgY2xhc3MgQ29ubmVjdGVkT3ZlcmxheVNjcm9sbEhhbmRsZXIge1xuXG4gICAgZWxlbWVudDogYW55O1xuXG4gICAgbGlzdGVuZXI6IGFueTtcblxuICAgIHNjcm9sbGFibGVQYXJlbnRzOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBhbnksIGxpc3RlbmVyOiBhbnkgPSAoKSA9PiB7fSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgfVxuXG4gICAgYmluZFNjcm9sbExpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLnNjcm9sbGFibGVQYXJlbnRzID0gRG9tSGFuZGxlci5nZXRTY3JvbGxhYmxlUGFyZW50cyh0aGlzLmVsZW1lbnQpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2Nyb2xsYWJsZVBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYWJsZVBhcmVudHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5saXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZVBhcmVudHMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zY3JvbGxhYmxlUGFyZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsYWJsZVBhcmVudHNbaV0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5saXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMubGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB0aGlzLnNjcm9sbGFibGVQYXJlbnRzID0gbnVsbDtcbiAgICB9XG59XG4iXX0=