import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommunityPageRoutingModule } from './community-routing.module';
import { CommunityPage } from './community.page';
import { NgChartsModule } from 'ng2-charts'; 
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PersonalBestComponent } from './personal-best/personal-best.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityPageRoutingModule,
    NgChartsModule // <-- Add this
  ],
  declarations: [CommunityPage, LeaderboardComponent, PersonalBestComponent]
})
export class CommunityPageModule {}